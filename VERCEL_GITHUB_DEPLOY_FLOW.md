# Vercel Deploy Flow via GitHub Actions (With Prisma)

This document explains the exact CI/CD flow we used so you can reuse it in new projects.

## What this solves

- Deploying to Vercel from GitHub Actions (not from Vercel Git integration)
- Node version mismatch on GitHub runner (`EBADENGINE`)
- Prisma failing during `postinstall` / `prisma generate` because DB env vars are missing

## High-level flow

1. GitHub push to `main` triggers workflow.
2. Workflow installs Node `22` (matching project engine requirements).
3. Workflow installs Vercel CLI.
4. Workflow pulls Vercel project metadata (`vercel pull`).
5. Workflow pulls production env vars into `.env` (`vercel env pull`).
6. Workflow validates DB env vars exist.
7. Workflow exposes DB vars to GitHub runner env (`$GITHUB_ENV`).
8. Workflow runs `vercel build --prod`.
9. Workflow deploys prebuilt output with `vercel deploy --prebuilt --prod`.

## Required GitHub secrets

Set these in GitHub repo: `Settings > Secrets and variables > Actions`.

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Required Vercel project environment variables

Set these in Vercel project: `Settings > Environment Variables`.

- `DATABASE_URL` (recommended baseline)
- `DATABASE_URL_UNPOOLED` (optional, if your Prisma config prefers it)

Important:
- Ensure these are enabled for **Production** environment.
- If missing in Production, Prisma can fail during build.

## Workflow template

Use this as your base `.github/workflows/vercel-deploy.yml`:

```yaml
name: Deploy to Vercel

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - main

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Pull Environment Variables for Prisma
        run: vercel env pull .env --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Validate Database Environment Variables
        shell: bash
        run: |
          if ! grep -q '^DATABASE_URL=' .env && ! grep -q '^DATABASE_URL_UNPOOLED=' .env; then
            echo "Missing DATABASE_URL and DATABASE_URL_UNPOOLED in Vercel production environment variables."
            exit 1
          fi

      - name: Expose Database Variables to GitHub Actions
        shell: bash
        run: |
          if grep -q '^DATABASE_URL_UNPOOLED=' .env; then
            grep '^DATABASE_URL_UNPOOLED=' .env >> "$GITHUB_ENV"
          fi
          if grep -q '^DATABASE_URL=' .env; then
            grep '^DATABASE_URL=' .env >> "$GITHUB_ENV"
          fi

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Prisma config recommendation

If Prisma crashes because one env var name is missing, make config accept both:

```ts
const datasourceUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
```

This avoids hard-failing when only one of the two is present.

## Why we do not use `cat .env >> $GITHUB_ENV`

Avoid appending the full `.env` file directly:
- `.env` may contain comments/metadata lines not valid for `$GITHUB_ENV`
- Can cause parser errors or unexpected env behavior

Instead, append only the exact keys you need (as in the workflow above).

## Troubleshooting quick map

- Error: `EBADENGINE`  
  Fix: set `actions/setup-node` to required version (here `22`).

- Error: `Cannot resolve environment variable: DATABASE_URL_UNPOOLED`  
  Fix:
  1. Ensure variable exists in Vercel Production env.
  2. Ensure workflow runs `vercel env pull`.
  3. Ensure workflow exposes DB vars into `$GITHUB_ENV`.
  4. Optionally add Prisma fallback to `DATABASE_URL`.

- Warning: `Build not running on Vercel. System environment variables will not be available.`  
  This is expected when running `vercel build` inside GitHub Actions; pull/expose env vars yourself as above.

## New project checklist

1. Add GitHub Action file from template.
2. Add GitHub secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
3. Add Vercel Production env vars (`DATABASE_URL`, optionally `DATABASE_URL_UNPOOLED`).
4. Confirm Prisma config supports your chosen DB variable names.
5. Push to `main` and check Actions logs.


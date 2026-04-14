# Citryn Next Boilerplate

Base repository for Citryn projects built on Next.js.

This repo is meant to be the repeatable starting point for new work: a clean App Router setup, Zustand ready for client-side state, Prisma installed for database workflows, and starter environment variables for local PostgreSQL development.

## Current Stack

- Next.js 16 with the App Router
- React 19
- Zustand for lightweight state management
- Prisma CLI for schema, migration, and database workflows
- ESLint 9 for baseline linting

## What Is Included

- `src/app` starter app structure
- branded home page and favicon
- `.env` with temporary local database values
- `.env.example` for safe sharing and onboarding
- a repo layout intended to be extended into future project templates

## Environment Variables

The included `.env` is temporary and intentionally local-first.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/next_boilerplate_dev?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/next_boilerplate_dev?schema=public"
SHADOW_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/next_boilerplate_shadow?schema=public"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="next_boilerplate_dev"
DB_USER="postgres"
DB_PASSWORD="postgres"
```

Replace those values before connecting this boilerplate to a real environment.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How To Use This Boilerplate

1. Clone or copy this repository for a new project.
2. Rename the app metadata, branding, and copy as needed.
3. Replace the temporary `.env` values with project-specific credentials.
4. Add a Prisma schema and install `@prisma/client` when the data model is ready.
5. Add your shared folders, UI primitives, utility libraries, and store structure.

## Recommended Next Setup

- add `prisma/schema.prisma`
- install `@prisma/client`
- create a shared Prisma client singleton in `src/lib`
- create a base Zustand store pattern for auth, UI, or session state
- add reusable components, utilities, and app conventions you want across projects

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- app/
|-- .env
|-- .env.example
|-- package.json
```

## Notes

- `.env` is ignored by git.
- `.env.example` is tracked so new projects have a template.
- Prisma is installed, but this repo does not yet define a schema or generated client.

That is deliberate. This repository is a base, not a finished opinionated product.

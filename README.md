# TX Local List

Next.js 16 app with secure signup/login, Prisma 7, Neon Postgres, a seeded admin account flow, a protected admin dashboard, and an event publishing flow designed for Vercel deployment.

## Included

- App Router auth flow with `/login` and `/signup`
- Scrypt-hashed passwords stored in Prisma
- HTTP-only, database-backed sessions with revocable session records
- Protected `/dashboard` route for signed-in users
- Protected `/admin` route for admin users only
- Admin accounts created only by the seed script or from the admin dashboard
- Public `/events` page with city, state, and tag filters
- Authenticated event creation flow with seeded default event tags
- Admin tag management from `/admin` for creating new event tags
- Neon adapter setup for Prisma 7 on Vercel

## Stack

- Next.js 16
- React 19
- Prisma 7
- Neon Postgres via `@prisma/adapter-neon`
- ESLint 9

## Environment Variables

Set these in local `.env` and in Vercel project settings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-example-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-with-a-long-random-password"
```

Notes:

- `DATABASE_URL` is the pooled Neon connection string used by the running app.
- `DATABASE_URL_UNPOOLED` is the direct Neon connection string used by Prisma CLI commands such as `db push` and migrations.
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are used by the seed script to create the initial admin account.
- `db:seed-tags` creates the default event tags used by the event creation form.

## Local Development

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

## Database Workflow

After you plug in your real Neon credentials:

```bash
npm run db:push
npm run db:seed-admin
npm run db:seed-tags
```

That will create the `User`, `Session`, `Event`, and `Tag` tables defined in `prisma/schema.prisma`, seed the initial admin account, and seed the default event tags.

## Events

- Public users can browse `/events`
- Filters currently support `city`, `state`, and `tag`
- Signed-in users can publish events from `/dashboard/events/new`
- The event form currently expects a hosted image URL for the event artwork

## Vercel Notes

- Keep this app on the default Vercel Node.js runtime.
- Add `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` in the Vercel dashboard before production deploys.
- `postinstall` already runs `prisma generate`, so the Prisma client is generated during installs on Vercel.

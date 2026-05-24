# test-web

Reference **HackKit Web App** for local development: Better Auth, libSQL, and HackKit UI flows (registration, Event Pass, check-in, event scanner).

## First run

From the repo root:

```bash
pnpm install
pnpm --filter test-web db:sync
pnpm --filter test-web dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, then use **Dashboard** → bootstrap owner (dev) → **Register**, **Pass**, and admin check-in / scanner routes.

## After schema changes

When **HackKit Core**, plugins, or auth tables change, re-sync before dev:

```bash
pnpm --filter test-web db:sync
```

`predev` runs the same sync automatically.

## Server Actions

Next.js requires `"use server"` in the app. Mutations live in `@hackkit/next`; thin wrappers are in [`app/actions.ts`](app/actions.ts) and delegate to `getRuntime().mutations`.

## Configuration

- [`hackkit.config.ts`](hackkit.config.ts) — plugins, User Data options, Event Types, database URL
- [`lib/runtime.ts`](lib/runtime.ts) — `createHackkitRuntime` composition root

# test-web

Production-ready **HackKit Web App** for Better Auth, libSQL/Turso, HackKit UI flows, Teams, RSVP, Discord verification, and notifications.

## First run

From the repo root:

```bash
pnpm install
pnpm --filter test-web db:sync
pnpm --filter test-web dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, then use **Dashboard** → bootstrap owner (dev) → **Register**, **Pass**, and admin check-in / scanner routes.

## After schema changes

When **HackKit Core**, plugins, or auth tables change, re-sync before dev and before release:

```bash
pnpm --filter test-web sync
```

`sync` updates plugin routes/actions and the local Drizzle schema. CI verifies those generated files are committed.

## Production setup

Production requires remote persistence and explicit auth, storage, owner, and Discord configuration:

```bash
DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
NEXT_PUBLIC_APP_URL=https://your-app.example.com
BETTER_AUTH_URL=https://your-app.example.com
BETTER_AUTH_SECRET=at-least-32-characters
BETTER_AUTH_TRUSTED_ORIGINS=https://your-app.example.com
HACKKIT_BLOB_ADAPTER=s3
HACKKIT_S3_BUCKET=...
HACKKIT_S3_REGION=...
HACKKIT_S3_ENDPOINT=...
HACKKIT_S3_ACCESS_KEY_ID=...
HACKKIT_S3_SECRET_ACCESS_KEY=...
HACKKIT_OWNER_EMAIL_ALLOWLIST=owner@example.com
DISCORD_GUILD_ID=...
DISCORD_BOT_API_URL=https://your-discord-bot.example.com
DISCORD_INTERNAL_AUTH_KEY=...
DISCORD_PARTICIPANT_ROLE_ID=...
```

Use `DISCORD_PARTICIPANT_ROLE_NAME` instead of `DISCORD_PARTICIPANT_ROLE_ID` only when role IDs are not available. Optional email delivery is configured with `HACKKIT_EMAIL_PROVIDER=resend` plus `RESEND_API_KEY`, or `HACKKIT_EMAIL_PROVIDER=smtp` plus `SMTP_HOST` and SMTP credentials.

## Release checks

Run the same app checks locally before deploying:

```bash
pnpm --filter test-web sync
pnpm --filter @hackkit/core test
pnpm --filter @hackkit/config test
pnpm --filter @hackkit/plugin-teams test
pnpm --filter @hackkit/plugin-discord test
pnpm --filter @hackkit/plugin-notifications-email test
pnpm --filter test-web typecheck
pnpm --filter test-web build
```

CI also runs package typechecks and builds for `@hackkit/core`, `@hackkit/config`, `@hackkit/next`, `@hackkit/ui`, `@hackkit/plugin-teams`, `@hackkit/plugin-discord`, and `@hackkit/plugin-notifications-email`.

## Server Actions

UI mutations live on the Next runtime (`runtime.mutations` from `createHackKitMutations`). Named server actions and the `hackKitUIActions` provider map ship from `@hackkit/next` — [`app/providers.tsx`](app/providers.tsx) passes `hackKitUIActions` to `HackKitUIProvider`. Plugin actions remain generated in [`app/hackkit-plugin-actions.ts`](app/hackkit-plugin-actions.ts) by `hackkit plugin sync`.

## Configuration

-   [`hackkit.config.ts`](hackkit.config.ts) — plugins, User Data options, Event Types, database URL
-   [`lib/runtime.ts`](lib/runtime.ts) — `createHackkitRuntime` composition root

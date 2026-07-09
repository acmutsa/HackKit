# test-web

Production-ready **HackKit Web App** for Better Auth, libSQL/Turso, HackKit UI flows, Teams, RSVP, Discord verification, and notifications.

## Local setup

Run every command below from the repository root.

### 1. Install prerequisites and dependencies

-   Node.js 20.x
-   pnpm 8.3.1

The repository enforces pnpm through `preinstall`.

```bash
pnpm install
```

### 2. Build the workspace dependencies

Build the packages that `test-web` imports before running commands that use the `hackkit` CLI:

```bash
pnpm exec turbo run build --filter=test-web^...
```

This builds the CLI and the workspace packages it depends on. `dev` repeats this build, but its `predev` script runs plugin sync first, so the initial build is still required on a fresh clone.

### 3. Configure local access (optional)

No environment file is required for a basic local run. Development defaults use:

-   `http://localhost:3000` for the app and Better Auth URLs
-   `file:.data/test-web.db` for the database
-   local storage in `.data/uploads`
-   no email provider and no Discord bot role-sync provider

To make your account an owner, create `apps/test-web/.env.local` before you sign up. Replace the example email with the one you will use:

```bash
cat > apps/test-web/.env.local <<'EOF'
HACKKIT_OWNER_EMAIL_ALLOWLIST=you@example.com
EOF
```

Alternatively, set `HACKKIT_OWNER_AUTH_ID_ALLOWLIST` to a Better Auth user ID. OAuth, email delivery, S3 storage, Turso, and Discord bot role sync are optional locally; configure them only when testing those integrations.

### 4. Generate app-owned files and sync the database

Create the generated plugin files and local libSQL database:

```bash
pnpm --filter test-web sync
```

`sync` runs both:

```bash
pnpm --filter test-web plugin:sync
pnpm --filter test-web db:sync
```

Use `db:reset` when you want a clean local database and upload directory:

```bash
pnpm --filter test-web db:reset
```

`db:reset` removes `apps/test-web/.data/test-web.db`, `apps/test-web/.data/ci.db`, their WAL/SHM files, and `apps/test-web/.data/uploads`, then re-runs database sync for both local and CI database files.

### 5. Start the app

```bash
pnpm --filter test-web dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up. If your email or auth ID is allowlisted, the app provisions your Owner role when it resolves your signed-in user. You can then use the registration, pass, check-in, and scanner routes.

### 6. Optional local checks

Run the full app verification path before handing off a change:

```bash
pnpm --filter test-web verify
```

`verify` runs:

```bash
pnpm sync
pnpm typecheck
pnpm build
```

From the repo root, those map to the filtered `test-web` scripts. `typecheck` also builds `@hackkit/cli` first because the `hackkit` binary is needed by app scripts.

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

## Next integration path

This app follows the single `@hackkit/next` integration path for runtime setup, page guards, Core mutations, and HackKit UI provider actions. See:

-   [`packages/next/README.md`](../../packages/next/README.md) — package API and wiring recipe
-   [`docs/guides/next-integration.md`](../../docs/guides/next-integration.md) — full guide and drift checks

## Release checks

Run the same app checks locally before deploying:

```bash
pnpm --filter test-web sync
pnpm --filter @hackkit/core test
pnpm --filter @hackkit/config test
pnpm --filter @hackkit/next test
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
-   [`lib/runtime.ts`](lib/runtime.ts) — `createHackkitRuntimeFromConfig` composition root; use `getPageGuards()` for layouts

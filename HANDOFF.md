# Handoff: HackKit core deepening (branch `evo`)

**Workspace:** `/Users/joshuasilva/Dev/Web/hackkit/main`  
**Branch:** `evo` — **complete** (two feature commits + green build)

---

## Goal

Deepen Core, Event Pass QR in HackKit UI, packages `@hackkit/next`, `@hackkit/auth-better-auth`, `@hackkit/cli`, slim `test-web`. Locked: plan **Grill decisions**; [ADR-0007](docs/adr/0007-event-pass-qr-in-hackkit-ui.md); [CONTEXT.md](CONTEXT.md).

---

## Done

- **Core:** `hackkit.accessControl`, `HackkitRuntimeContext`, domain-only `checkIn` / `recordEventScan`, in-memory DB + Vitest (3 tests), `AuthAdapter`, ESM.
- **UI:** `event-pass.ts`, scanners use client `rawQr` + preview/confirm actions, `eventPassQrTtlMs` on provider.
- **Packages:** `@hackkit/auth-better-auth`, `@hackkit/next` (runtime, mutations, page guards), `@hackkit/cli` (`hackkit db sync`).
- **test-web:** `hackkit.config.ts`, `lib/runtime.ts`, `app/actions.ts` (Server Actions in-app per Next.js), `predev` db sync; removed `lib/hackkit.ts`, `lib/actor.ts`.
- **Commits:** `c789bd0` (kernel + UI), `e4b5c9c` (integration).
- **Green:** `pnpm -r typecheck`, `pnpm --filter @hackkit/core test`, `pnpm --filter test-web build`.

---

## Server Actions note

`@hackkit/next` does **not** export `"use server"` actions (Next cannot bundle them from dependency packages). `apps/test-web/app/actions.ts` wraps `getRuntime().mutations`.

---

## Merge

1. Open PR `evo` → `dev` (or target branch).
2. Smoke: sign-in → register → pass → admin check-in / event scanner (authenticated volunteer).
3. Push when ready.

Plan: `.cursor/plans/core_deepening_refactor_e225f59d.plan.md`

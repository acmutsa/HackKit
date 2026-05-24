# Handoff: HackKit core deepening (branch `evo`)

**Workspace:** `/Users/joshuasilva/Dev/Web/hackkit/main`  
**Branch:** `evo` (implementation in working tree; **no commits** from this work yet)

---

## Goal

Finish the plan in `.cursor/plans/core_deepening_refactor_e225f59d.plan.md`: deepen Core, QR/check-in in HackKit UI, new packages `@hackkit/next`, `@hackkit/auth-better-auth`, `@hackkit/cli`, slim `test-web`. **Two commits** on `evo`, merge when green.

Locked decisions: plan section **Grill decisions**; [docs/adr/0007-event-pass-qr-in-hackkit-ui.md](docs/adr/0007-event-pass-qr-in-hackkit-ui.md); [CONTEXT.md](CONTEXT.md).

---

## Done

- **Core:** `hackkit.accessControl`, shared `HackkitRuntimeContext`, domain-only `checkIn`/`recordEventScan` (no QR), in-memory DB + Vitest (3/3 pass), `AuthAdapter` type, ESM (`NodeNext` + `.js` imports).
- **UI:** `packages/ui/src/event-pass.ts`, scanners use client state + `rawQr` actions, `HackKitUIProvider.eventPassQrTtlMs`.
- **Packages:** `@hackkit/auth-better-auth`, `@hackkit/next` (runtime, mutations, `"use server"` actions), `@hackkit/cli` (`hackkit db sync` via jiti).
- **test-web:** `hackkit.config.ts`, `lib/runtime.ts`; removed `lib/hackkit.ts`, `lib/actor.ts`, `app/actions.ts`, `lib/auth-schema.ts`; pages use `getHackkit()` / `getPageGuards()`.
- **typecheck** passes; **db sync** works; **core tests** pass.

---

## Blocker: `pnpm --filter test-web build` fails

- Missing exports from `@hackkit/next` / `@hackkit/next/actions`.
- `Cannot find module 'private-next-rsc-server-reference'` (Server Actions in dependency package).

**Fix (recommended):** Option B from handoff — mutations stay in `@hackkit/next` without `"use server"` in package; add thin `apps/test-web/app/actions.ts` with `"use server"` that calls `createHackKitMutations` from runtime. Also rebuild `@hackkit/next` as ESM (`module: NodeNext`, `.js` imports) — `packages/next/dist/actions.js` may still be CJS.

---

## Next steps

1. Fix Server Actions + `@hackkit/next` build output.
2. `pnpm --filter test-web build` then `dev` smoke (pass, check-in, event scanner).
3. Two commits: (1) core + ui + adr + CONTEXT, (2) auth + next + cli + test-web + lockfile.
4. Do not push unless user asks.

---

## Key paths

| Area | Path |
|------|------|
| Plan | `.cursor/plans/core_deepening_refactor_e225f59d.plan.md` |
| Runtime | `apps/test-web/lib/runtime.ts` |
| Mutations | `packages/next/src/mutations.ts` |
| Server actions | `packages/next/src/actions.ts` |

---

## Skills

Use **diagnose** for the Next build issue; **handoff** to read this file first.

# Keep Event Pass QR in HackKit UI, not HackKit Core

Hackathon check-in and event scan APIs in HackKit Core accept only domain fields such as `targetAuthId`. Event Pass QR encoding, parsing, and TTL validation live in HackKit UI. Server mutations in `@hackkit/next` import those helpers and accept raw QR strings from client actions before calling Core.

## Context

Early Core implementations coupled QR validation to `users.checkIn` and `events.recordEventScan`. That tied the kernel to one physical check-in mode and pulled presentation concerns into the domain layer.

## Decision

- Remove QR-specific fields and validation from Core User/Event APIs.
- Implement Event Pass QR helpers in `@hackkit/ui`.
- Parse and validate raw QR in `@hackkit/next` mutations (`previewEventPassQr`, `checkInUser`, `recordEventScan`).
- Keep scanner UX in HackKit UI with client-only scan state; confirm sends `rawQr` to server actions.

## Consequences

- Core stays framework- and presentation-free; alternate check-in UIs can call the same Core APIs.
- Apps configure Event Pass QR TTL when wiring `HackKitUIProvider` and mutations, not via `createHackkit`.
- Security depends on server-side QR validation in mutations, not URL query parameters.

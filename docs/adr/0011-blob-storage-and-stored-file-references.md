# Blob Storage Adapter and app-relative Stored File References

Files (e.g. resumes on **Hacker Registration**) are stored outside **HackKit Core** through a **Blob Storage Adapter** contract in Core, with separate packages for local filesystem (development) and S3-compatible presigned upload (production). **HackKit Core** persists only **Stored File References**: app-relative URLs such as `/api/files/view?key=...`, not raw bucket URLs or bare storage keys alone.

## Context

- Legacy **apps/web** used R2 presigned uploads and app routes (`/api/upload/resume/...`) that return app-relative view URLs stored on hacker rows.
- **HackKit Core** already has optional `resumeUrl` on **Hacker**; there was no adapter boundary, and resume “missing” used a legacy sentinel URL constant.
- **Competitor Onboarding** this milestone includes resume upload in **HackKit UI** with test-web defaulting to local storage for contributors without cloud credentials.

## Decision

- Define **Blob Storage Adapter** in **HackKit Core**; implement `@hackkit/blob-local` and `@hackkit/blob-s3` (or equivalent names) as separate packages.
- **HackKit Web Apps** select an implementation in `hackkit.config.ts`; test-web defaults to local.
- After upload, the app passes a **Stored File Reference** (app-relative URL) into Core APIs; Core does not talk to blob backends directly.
- Resume is optional: omit `resumeUrl` when the user skips upload; no sentinel “no resume provided” string in Core records.
- **HackKit UI** **Hacker Registration** form accepts upload via app-provided handlers; resulting URL is submitted with `registerHacker`.

## Alternatives considered

- **Direct public CDN URLs in Core** — Rejected; host/bucket changes invalidate rows and leak infrastructure into the domain.
- **Opaque storage keys only in Core** — Rejected for v1; every read path would need adapter resolution in UI and exports; more wiring before onboarding ships.
- **Core-owned file model / attachment entity** — Rejected; glossary keeps blobs at the adapter boundary.
- **Single backend hard-coded in Core** — Rejected; prevents local dev without cloud keys.
- **Legacy sentinel URL for “no resume”** — Rejected; optional field is sufficient for v1 reporting (`resumeUrl` present vs absent).

## Consequences

- Each **HackKit Web App** must implement routes that serve or proxy files for **Stored File References** (local read path vs S3 redirect/proxy).
- Switching from local to S3 does not require migrating Core rows if URL shape stays app-relative and keys remain stable in the query/path convention.
- Upload security (auth, content type, size limits) stays in the Web App and adapter packages, not in Core validation of `registerHackerSchema` alone.
- Plugins or future file types reuse the same adapter contract; avoid ad hoc upload routes per feature without extending the adapter interface deliberately.

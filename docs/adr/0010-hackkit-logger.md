# HackKit Logger (Better Auth–style, pluggable)

HackKit exposes a replaceable **HackKit Logger** at `createHackkit` and in `hackkit.config.ts`, modeled after Better Auth’s `logger` option: minimum **Log Level**, optional `disabled`, and a custom `log(level, message, ...args)` implementation. Significant **HackKit Core** domain APIs emit structured operational lines at `info`/`debug`; this is not a persisted audit table or the legacy SQL `error_log`.

## Context

- Legacy **apps/web** persisted errors in an `error_log` table via `logError`, separate from framework diagnostics.
- **HackKit Core** had no logging contract; Better Auth already supports its own `logger` on `betterAuth({ ... })`.
- Operators need visibility into domain actions (registration, approval, check-in) without storing PII in the database or coupling Core to a specific vendor (Datadog, Sentry, stdout).

## Decision

- Define a **HackKit Logger** type in **HackKit Core** with levels `debug` | `info` | `warn` | `error`, `disabled`, and optional custom `log`.
- Ship a default console implementation when the app omits `logger`.
- Default minimum **Log Level**: `info` when `NODE_ENV` is development, `warn` in production, overridable in config.
- **HackKit Core** logs significant domain API calls (e.g. **Hacker Registration**, **Organiser Approval**, **Hackathon Check-in**) with **Log Context**: action name, outcome, **Auth ID**s, stable record ids, and **HackKit** error code/message on failure — never emails, names, or form payloads.
- **HackKit CLI** commands run from a **HackKit Web App** directory read the same `logger` from `hackkit.config.ts`, falling back to the environment-based default when omitted.
- **@hackkit/auth-better-auth** bridges the app’s **HackKit Logger** into Better Auth’s `logger.log` so one custom implementation in config can cover auth and Core output.

## Alternatives considered

- **Persisted error/audit tables** — Rejected for this milestone; different retention, query, and compliance model than framework logging.
- **Stdout-only, no contract** — Rejected; apps could not forward to hosted logging without forking Core.
- **Independent Better Auth logger only** — Rejected; duplicate config and divergent formats in typical apps.
- **Verbose `debug` payloads (form fields)** — Rejected; PII risk and weak redaction story across custom loggers.

## Consequences

- No SQL `error_log` parity in v1; organisers who need searchable error history may add a custom logger that writes to their store.
- Core gains a small amount of logging overhead on hot paths; keep messages cheap and level-gated.
- Custom loggers must treat **Log Context** as potentially sensitive even without full payloads (Auth IDs are still identifiers).
- Better Auth internal messages and HackKit domain messages share one pipeline when the bridge is used; apps that need separation can pass different implementations to Core vs the auth adapter factory.

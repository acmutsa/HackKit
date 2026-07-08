# HackKit

HackKit is a toolkit for building hackathon management applications while keeping the reusable hackathon domain separate from any specific web implementation.

## Language

**HackKit Core**:
The framework-independent HackKit kernel that defines hackathon domain concepts and application use-cases behind stable APIs.
_Avoid_: Framework runtime, web app, Next app

**HackKit Web App**:
A fully built HackKit application that assembles UI, routes, and adapters into a working hackathon site. Next.js apps wire Core, guards, mutations, and HackKit UI through `@hackkit/next` — see [`docs/guides/next-integration.md`](docs/guides/next-integration.md).
_Avoid_: Core, kernel

**HackKit UI**:
A replaceable component package that renders HackKit interfaces by consuming HackKit Core APIs.
_Avoid_: Web app, core

**HackKit CLI**:
A command-line tool for creating HackKit projects and managing plugin-provided project files.
_Avoid_: Runtime, core

**HackKit Plugin**:
An extension passed to HackKit Core at creation time that may add capabilities, data models, permissions, storage schema contributions, API methods, hooks, and project files.
_Avoid_: App fork, core patch

**Auth ID**:
The provider-issued identifier for the authenticated person using a HackKit application.
_Avoid_: Clerk ID, internal user ID, auth subject

**Auth Adapter**:
An integration boundary that translates an authentication provider's session and profile into HackKit's Auth ID and User identity fields.
_Avoid_: HackKit Core auth system, session store

**Database Adapter**:
An integration boundary that persists HackKit's canonical data models using a concrete database technology.
_Avoid_: App schema mapper, repository bundle

**Storage Schema**:
An adapter-neutral description of HackKit model fields, constraints, and model relationships that database adapters compile into concrete storage schemas.
_Avoid_: Drizzle schema, SQL migration, app-owned table mapping

**Drizzle Database Adapter**:
A Database Adapter that persists HackKit's canonical data models through Drizzle ORM.
_Avoid_: Existing app database package, app schema mapper

**HackKit Logger**:
A replaceable logging boundary for HackKit runtime diagnostics and operational messages, configured when creating **HackKit Core** (similar in spirit to Better Auth’s built-in logger: levels, disable switch, optional custom `log` implementation).
_Avoid_: Legacy `error_log` tables, **Audit Log**, **Auth Adapter** session storage

**Log Level**:
The minimum severity a **HackKit Logger** emits: `debug`, `info`, `warn`, or `error`.
_Avoid_: **Permission** keys, **Role** hierarchy position

**Log Context**:
Structured metadata attached to a **HackKit Logger** message: action name, outcome, **Auth ID**s, stable domain record ids (event, team, role), and on failure the **HackKit** error code and message — not emails, names, or form field values.
_Avoid_: Full request payloads, **User Data** answers, resume contents

**Notification Intent**:
A persisted, provider-neutral record that a HackKit domain transition should notify one or more recipients, with a typed notification kind and payload supplied by **HackKit Core**.
_Avoid_: Email, Discord message, rendered template, immediate side effect

**Notification Delivery Attempt**:
One attempt by a **Notification Channel Plugin** to deliver a **Notification Intent** through a concrete channel.
_Avoid_: Notification intent, audit log, domain event

**Notification Channel Plugin**:
A **HackKit Plugin** that subscribes to **Notification Intents**, resolves channel-specific destinations, renders templates for that channel, and records **Notification Delivery Attempts**.
_Avoid_: HackKit Core notification sender, generic transport helper

**Email Notification Plugin**:
A HackKit-maintained **Notification Channel Plugin** that delivers **Notification Intents** by email through configured providers such as Resend or SMTP.
_Avoid_: Auth adapter, app-owned mailer, hard-coded email service in **HackKit Core**

**Blob Storage Adapter**:
An integration boundary that lets a HackKit Web App store files and pass resulting URLs or keys into HackKit Core. The contract lives in **HackKit Core**; concrete implementations (e.g. local filesystem, S3-compatible) ship as separate packages configured per **HackKit Web App**.
_Avoid_: HackKit Core file system, attachment domain model

**Stored File Reference**:
An app-relative URL a **HackKit Web App** persists on domain records (such as `resumeUrl` on a **Hacker**) after uploading through a **Blob Storage Adapter**, so the same **HackKit Web App** can serve or proxy the file regardless of storage backend.
_Avoid_: Presigned upload URL, bare storage key without an app route, hard-coded CDN hostname in **HackKit Core** records

**User**:
An authenticated person who can use a HackKit application.
_Avoid_: Hacker, participant

**Hacker**:
A User who is competing in the hackathon and has competitor-specific registration data.
_Avoid_: User, attendee, organizer, judge

**Competitor Onboarding**:
The end-to-end journey for a person to become a competing **Hacker** in a HackKit application, in order: authenticate, become a **User**, claim a **HackTag**, complete **User Data**, complete **Hacker Registration**, then resolve **Organiser Approval** according to hackathon configuration.
_Avoid_: A single monolithic registration submit, **User Data** collection alone

**Hacker Registration**:
The **Competitor Onboarding** step that creates or updates a **Hacker** record after **User Data** is complete.
_Avoid_: **User Data**, auth sign-up, claiming a **HackTag**

**Competitor Onboarding Progress**:
A **HackKit UI** component that displays **Competitor Onboarding** step labels and completion state from props; it does not enforce redirects.
_Avoid_: Enforced onboarding middleware, **Role** management UI

**Organiser Approval**:
Whether a **User** may access full participant capabilities after finishing **Competitor Onboarding**, represented by `isApproved` on the **User** record.
_Avoid_: **Hackathon Check-in**, **Event** RSVP

**Require Approval**:
A per-hackathon setting that controls **Organiser Approval** after **Competitor Onboarding** completes. When required, `isApproved` stays false until an organiser approves the **User**. When not required, completing the final onboarding step sets `isApproved` true automatically.
_Avoid_: **Permission** keys, registration open/closed toggles

**Hackathon Setting**:
A typed, runtime-adjustable hackathon policy value that changes participant-facing behavior without redeploying the **HackKit Web App**.
_Avoid_: App setting, feature flag, environment config, config-backed option

**Hackathon Settings Registry**:
The collection of **Hackathon Setting** definitions contributed by **HackKit Core** and **HackKit Plugins**, including each setting's type, default, label, description, and optional category.
_Avoid_: Unstructured key/value store, feature flag list

**Maximum Registrations**:
The maximum number of **Hackers** who may complete first-time **Hacker Registration**, with zero meaning unlimited.
_Avoid_: RSVP limit, attendance limit, approved capacity, venue size

**Hackathon Capacity**:
The maximum number of **Hackers** who may receive **Organiser Approval**, with zero meaning unlimited.
_Avoid_: Maximum registrations, RSVP limit, attendance limit, volunteer capacity, organiser capacity

**HackTag**:
A public handle that identifies a User within a HackKit application once claimed.
_Avoid_: Hacker tag, username

**User Data**:
Required MLH, demographic, and logistics information collected for every User at a HackKit-managed hackathon.
_Avoid_: Hacker data, profile

**User Data Option**:
A stable stored value and display label pair for a configurable User Data answer.
_Avoid_: Raw select label, hardcoded enum member

**User Data Options**:
The configurable allowed values for User Data fields whose valid answers vary by hackathon, compliance wording, or locale.
_Avoid_: Hardcoded demographic enums, UI select options

**Role**:
A named access level assigned to Users that grants permissions and establishes hierarchy.
_Avoid_: User type, group

**Permission**:
A namespaced capability key granted through a Role.
_Avoid_: Role, feature flag, bitmask

**Settings Management Permission**:
The **Permission** that allows a **User** to list and change **Hackathon Settings**.
_Avoid_: **Admin Permission**, plugin-specific settings role

**Admin Permission**:
The Permission that bypasses ordinary permission-key checks while still respecting Role hierarchy.
_Avoid_: Super admin

**Super Admin Permission**:
The Permission that bypasses both ordinary permission-key checks and Role hierarchy checks.
_Avoid_: Admin

**Event**:
A timed activity on the hackathon agenda, such as a workshop, meal, ceremony, or social.
_Avoid_: Side event (in user-facing copy), the hackathon itself, DOM event, legacy storage name `name` for title

**Event Type**:
A configured category for an **Event**, defined at HackKit application setup with a stable stored value, display label, and color.
_Avoid_: Freeform tag without configured options, per-row color overrides, using the display label as the stored value

**Event Types**:
The configurable allowed **Event Type** values for a hackathon, each with value, label, and color, shared by HackKit Core validation and HackKit UI rendering.
_Avoid_: Hardcoded type enums, UI-only select options, legacy Title Case keys used as stored values

**Event Scan**:
One recorded time a **User**'s **Event Pass** was scanned for a specific **Event**.
_Avoid_: **Hackathon Check-in**, RSVP, cumulative scan count on one row

**Event Scans**:
The history of scan occurrences for a **User** at an **Event**; each scan is its own persisted record.
_Avoid_: Single row with incrementing count

**Scanning Volunteer**:
The **User** who confirmed an **Event Scan** on behalf of the hackathon.
_Avoid_: Scanned participant, Auth provider account

**Event Pass**:
The participant-facing QR identity a **User** presents to be scanned at **Events**.
_Avoid_: Ticket, badge

**Event Pass QR TTL**:
The maximum age of an **Event Pass** QR timestamp that volunteer scan flows accept before check-in or **Event Scan** is recorded.
_Avoid_: Session timeout, auth token expiry

**Event Pass QR**:
The encoded payload (including participant identity and issue time) presented as a scannable **Event Pass**. Encoding, parsing, and freshness checks are implemented in **HackKit UI**; the server mutation layer imports the same module to validate raw QR on confirm before calling **HackKit Core**.
_Avoid_: HackKit Core module, separate credential registry package

**Group**:
A hackathon-defined participant cohort assigned to **Hackers**, separate from **Teams**, used for organizer operations and optional Discord role mapping.
_Avoid_: Team, Role, Discord guild, capacity limit

**Team**:
A competition entry for **Hackers** with a unique **Team Tag**, owned by one **Team Owner**.
_Avoid_: Role, organization account, staff group

**Team Tag**:
The unique public handle for a **Team**, used to identify the team within a HackKit application.
_Avoid_: HackTag, slug without uniqueness guarantee

**Team Owner**:
The **Hacker** who created a **Team** and may invite members or remove non-owner members.
_Avoid_: Admin, organizer

**Team Member**:
A **Hacker** who belongs to a **Team**.
_Avoid_: User, invitee, organizer

**Maximum Team Size**:
The maximum number of **Team Members** allowed on a **Team**, with zero meaning unlimited.
_Avoid_: **Hackathon Capacity**, pending invite limit, team count

**Team Invite**:
A pending, accepted, or declined request for a **Hacker** to join a **Team**.
_Avoid_: RSVP, role assignment, email notification

**Hackathon Check-in**:
A one-time record that a **User** arrived and was checked in to the hackathon as a whole.
_Avoid_: **Event Scan**, RSVP

**RSVP**:
An approved **Hacker**'s pre-arrival confirmation that they intend to attend, recorded before **Hackathon Check-in** and governed by RSVP-specific hackathon settings.
_Avoid_: **Organiser Approval**, **Hackathon Check-in**, **Event Scan**

**RSVP Waitlist**:
An optional first-come list of approved **Hackers** who attempted to RSVP after the RSVP limit was reached and may be promoted by organizers.
_Avoid_: **Organiser Approval** queue, **Hackathon Capacity**, automatic acceptance

## Relationships

-   **HackKit Web App** depends on **HackKit Core** for hackathon behavior.
-   **HackKit UI** consumes **HackKit Core** APIs.
-   **HackKit UI** ships default schedule, **Event Pass**, volunteer scanner, and event admin components that **HackKit Web Apps** may replace individually without forking Core.
-   **HackKit CLI** creates projects that include a working **HackKit Web App**.
-   **HackKit CLI** manages project files provided by plugins.
-   **HackKit CLI** merges plugin-owned Next.js routes into a **HackKit Web App** using generated re-export stubs and records ownership in **hackkit.lock**.
-   **HackKit CLI** runs from a **HackKit Web App** project directory (not a monorepo root) and reads that app’s `hackkit.config.ts` for plugins and database settings.
-   **HackKit CLI** uses the same **HackKit Logger** from `hackkit.config.ts` when run from a **HackKit Web App** directory, falling back to the environment-based default **Log Level** when `logger` is omitted.
-   A **HackKit Plugin** may add capabilities to a **HackKit Web App** without changing **HackKit Core** source.
-   **HackKit Core** accepts an optional **HackKit Logger** at creation time; when omitted, a default console **HackKit Logger** applies with a configurable **Log Level** defaulting to `info` in development and `warn` in production unless overridden.
-   **HackKit Web Apps** may replace the default **HackKit Logger** with a custom implementation (for example forwarding to a hosted logging service) without changing **HackKit Core** source.
-   **HackKit Core** emits operational messages for significant domain APIs (such as **Hacker Registration**, **Organiser Approval**, **Hackathon Check-in**) through the **HackKit Logger** at **Log Level**s such as `info` or `debug`; this is not a separate persisted **Audit Log** model in v1.
-   **Log Context** for those messages includes action name, outcome, **Auth ID**s, relevant record ids, and error codes on failure; it excludes PII and form payloads.
-   **Hackathon Setting** changes are emitted through the **HackKit Logger** with **Log Context** including the actor **Auth ID** and setting key, but v1 stores only the latest setting value rather than a persisted change history.
-   **HackKit Core** receives **HackKit Plugins** through `createHackkit`.
-   **HackKit Plugins** should be configured in one place so package-specific integration details stay contained inside plugin packages.
-   **HackKit Plugins** expose storage schema contributions using **Storage Schema** without requiring every plugin to implement every database dialect.
-   **Storage Schema** can express field-level single-column references between plugin models and **HackKit Core** models.
-   **HackKit Core** owns **Notification Intents** and typed notification payloads; **Notification Channel Plugins** own channel-specific destination resolution, rendering, delivery, and **Notification Delivery Attempts**.
-   **Notification Intents** are persisted before delivery so channel plugins may process them asynchronously and retry failed **Notification Delivery Attempts**.
-   The **Email Notification Plugin** is configured as a **HackKit Plugin**; **HackKit Core** does not send email directly.
-   **Storage Schema** uses domain property names; database adapters map them to concrete column names.
-   Database adapters derive table names from namespaced model keys using deterministic naming conventions.
-   SQLite table names use a `hackkit_` prefix followed by namespace and snake-cased model name.
-   Database adapters map **Storage Schema** field names to snake_case column names by default.
-   Database adapters translate query inputs and returned records so **HackKit Core** only sees domain property names.
-   **Storage Schema** supports static default values and symbolic dynamic defaults such as creation timestamps and generated string IDs.
-   Database adapters apply **Storage Schema** defaults before inserting records to keep behavior consistent across dialects.
-   **HackKit Core** may still set domain timestamps and IDs explicitly in application behavior.
-   **Storage Schema** distinguishes integer fields from general numeric fields.
-   **Storage Schema** supports string enum fields for constrained domain values.
-   **Storage Schema** represents arrays and structured objects as JSON fields.
-   **Storage Schema** supports field-level and composite uniqueness constraints.
-   **Storage Schema** supports simple single-field and composite non-unique indexes.
-   Persistent model descriptors combine typed model identity with **Storage Schema** so model keys and storage definitions do not drift.
-   Persistent model record types are inferred from **Storage Schema** definitions.
-   **Storage Schema** distinguishes selected record types from insert input types so defaulted fields can be optional on insert and present after persistence.
-   Database adapters accept insert input types and return selected record types derived from persistent model descriptors.
-   Public Core record types such as **User**, **Role**, and **Hacker** are inferred aliases from Core model descriptors.
-   **HackKit Core** merges its base **Storage Schema** with **HackKit Plugin** storage schemas before initializing adapter factories.
-   **HackKit Core** initializes adapter factories with plugin contributions so applications do not pass plugin config to each adapter separately.
-   An **Auth Adapter** supplies **Auth IDs** and User identity fields to a **HackKit Web App** before it calls **HackKit Core**.
-   The **Better Auth** integration may forward **HackKit Logger** messages through Better Auth’s own `logger` configuration so a single custom `log` implementation in `hackkit.config.ts` covers auth and **HackKit Core** output.
-   A **User Data** onboarding flow may display the authenticated **User** while collecting **User Data**.
-   **HackKit UI** treats authenticated **User** information passed to forms as display context, not as authorization input.
-   A **Database Adapter** persists **HackKit Core** models using HackKit-owned canonical storage shapes.
-   The **Drizzle Database Adapter** targets SQLite/libSQL first while preserving room for future dialect support.
-   The **Drizzle Database Adapter** exposes dialect-specific entrypoints so each dialect can use native Drizzle schema definitions.
-   The **Drizzle Database Adapter** can generate concrete Drizzle schema from merged **Storage Schema** before full HackKit CLI migration tooling exists.
-   A **Blob Storage Adapter** stores files outside **HackKit Core**; **HackKit Core** stores only **Stored File References** supplied by the **HackKit Web App**.
-   **HackKit Web Apps** choose a **Blob Storage Adapter** implementation via configuration; local filesystem adapters suit development, S3-compatible adapters suit production.
-   A **User** is identified by exactly one **Auth ID** in a HackKit application.
-   A **User** may have zero or one **Hacker** profile.
-   **Competitor Onboarding** is the product journey that produces a **Hacker**; each step uses separate **HackKit Core** operations and **HackKit Web App** routes rather than one combined registration transaction.
-   **Competitor Onboarding** step order is: authenticate → **User** → **HackTag** → **User Data** → **Hacker Registration** → **Organiser Approval**.
-   **Require Approval** is a **Hackathon Setting**, not static **HackKit Web App** configuration.
-   **Hackathon Settings** are owned by **HackKit Core** and surfaced by **HackKit Web Apps** through admin UI.
-   **HackKit Core** defines built-in **Hackathon Settings** and **HackKit Plugins** may contribute plugin-specific **Hackathon Settings** to the **Hackathon Settings Registry**.
-   A hackathon policy is either a **Hackathon Setting** or static **HackKit Web App** configuration, never both at the same time.
-   A **HackKit Web App** may ship the full multi-step **Competitor Onboarding** flow before enforcing **Organiser Approval** gates in routes and UI.
-   Early **HackKit Web App** implementations may use guided “next step” links without hard redirects between onboarding steps; strict step enforcement may come later.
-   **HackKit UI** may provide a **Competitor Onboarding Progress** component that displays step labels and completion state from props supplied by the **HackKit Web App** (no hard redirects).
-   **HackKit Web Apps** may expose each **Competitor Onboarding** step at its own route under a shared prefix (for example `/onboarding/...`).
-   **HackKit UI** ships default forms for **Competitor Onboarding** steps, including **HackTag** claim, **User Data**, and **Hacker Registration**; **HackKit Web Apps** wire routes, server actions, and adapters.
-   **Hacker Registration** resume uploads use a **Blob Storage Adapter** in the **HackKit Web App**; **HackKit Core** stores only the **Stored File Reference** on the **Hacker** record when provided; omitting a resume leaves `resumeUrl` unset (no sentinel placeholder).
-   A **Hacker** belongs to exactly one **User**.
-   A **Hacker** may have zero or one **Group**.
-   **Group** assignment happens when a **Hacker** receives **Organiser Approval** if no **Group** has been assigned yet.
-   Automatic **Group** assignment uses round-robin distribution across enabled **Groups**; **Groups** do not impose capacity limits.
-   **Hackathon Capacity**, not **Group** membership, controls how many **Hackers** may receive **Organiser Approval**.
-   Organizers and judges are **Users** with **Roles**, not **Hackers**, unless they are also competing.
-   A **User** has one **Role** in v1.
-   Completing **Hacker Registration** assigns the hackathon’s default competitor **Role** from `hackkit.config.ts`; auth sign-up and `ensureUser` do not assign a **Role** by themselves.
-   A **Role** grants zero or more **Permissions**.
-   **Permissions** use namespaced keys so plugins can add capabilities without collisions.
-   **Admin Permission** is represented by `core.admin`.
-   **Super Admin Permission** is represented by `core.super_admin`.
-   A **User** may have zero or one **HackTag**.
-   A **User** has exactly one **User Data** record for hackathon-required information such as dietary restrictions.
-   A **User Data Option** has a stable stored value and a display label.
-   **User Data Options** constrain selected **User Data** fields and are shared by HackKit Core validation and HackKit UI rendering.
-   **Dietary Restrictions** are stored as configured **User Data Option** values; freeform dietary or accessibility needs belong in the **User Data** accommodation note.
-   An **Event** has zero or more **Event Scans**.
-   An **Event Scan** belongs to exactly one **Event** and exactly one **User**.
-   A **User** may have many **Event Scans** for the same **Event**; each scan is stored as a separate row.
-   **Event Scan** history is append-only in v1; mistaken scans are not deleted through Core APIs.
-   When a **User** already has **Event Scans** for an **Event**, volunteers are warned before recording another scan but may still add one.
-   Each **Event Scan** records which volunteer **User** performed the scan.
-   **HackKit UI** (and the server mutation layer ahead of **HackKit Core**) validates **Event Pass QR** freshness using a configurable **Event Pass QR TTL** before calling **Hackathon Check-in** or **Event Scan** APIs with a resolved **Auth ID**.
-   **Hackathon Check-in** APIs live on the **User** module; **Event** CRUD and **Event Scan** APIs live on the **Events** module.
-   A **User** presents their **Event Pass** to be scanned at **Events**.
-   Any **User** may present an **Event Pass** and be recorded in an **Event Scan**; a **Hacker** profile is not required for attendance flows.
-   **Stored File References** use app-relative URLs (for example `/api/files/view?key=...`), not direct bucket URLs in **HackKit Core** records.
-   **Hackathon Check-in** is separate from **Event Scan**; arriving at the venue is not the same as attending a specific **Event**.
-   **Hackathon Check-in** is recorded on the **User** as an optional arrival timestamp set by a volunteer with check-in permission.
-   A **User** may be **Hackathon Check-in** checked in at most once; repeat check-in attempts are rejected.
-   A volunteer with check-in permission may clear an existing **Hackathon Check-in** to correct a mistake.
-   **Event Types** constrain the type field on **Event** records and are shared by HackKit Core validation and HackKit UI rendering.
-   Each **Event Type** has a stable stored value, display label, and color, using the same value/label pattern as **User Data Options**.
-   **Event** records use string identifiers in HackKit Core.
-   Public schedule listing of non-hidden **Events** does not require an authenticated **User**; actors with `core.events.view` or higher can list hidden **Events** as well.
-   An **RSVP** may be recorded only for an approved **Hacker**.
-   **RSVP** has hackathon settings separate from **Hackathon Capacity**, including whether RSVP is open, the RSVP limit, and whether the **RSVP Waitlist** is enabled.
-   **RSVP Waitlist** promotion is organizer-managed in v1; HackKit does not automatically promote **Hackers** from the **RSVP Waitlist**.
-   A **Hacker** cannot self-cancel an **RSVP** in v1; organizers may correct RSVP state.
-   A **Team** belongs to the teams plugin domain and is composed of **Team Members** who must be **Hackers**.
-   Each **Hacker** may belong to at most one **Team** in v1.
-   Each **Team** has exactly one **Team Owner**, who is always a **Team Member**.
-   **Team Invites** are sent by the **Team Owner** and responded to by the invited **Hacker**.
-   **Team Invites** use pending, accepted, and declined statuses in v1.
-   **Maximum Team Size** belongs to the teams plugin settings, defaults to four, and is enforced when a **Team Invite** is accepted or a member is otherwise added to a **Team**.

## Example dialogue

> **Dev:** "Should registration live in the web app or in **HackKit Core**?"
> **Domain expert:** "The registration behavior belongs in **HackKit Core**; the **HackKit Web App** only wires it to routes and UI."

> **Dev:** "Are schedule workshops the same thing as check-in at the door?"
> **Domain expert:** "No. **Events** are agenda items volunteers scan at with **Event Pass**. **Hackathon Check-in** is the one-time arrival record for the whole hackathon."

> **Dev:** "If someone swipes twice at lunch, is that one row with count 2?"
> **Domain expert:** "No. Each swipe is its own **Event Scan**. The scanner warns the volunteer if they've already scanned, but they can still record another scan when seconds opens up."

> **Dev:** "What does test-web need to ship for events?"
> **Domain expert:** "Public schedule, **Event Pass**, event admin, event scanner, and hackathon check-in — enough to prove Core, UI, and the app wiring together."

## Flagged ambiguities

-   "core" could mean either a complete web framework or a domain/application kernel — resolved: **HackKit Core** is the framework-independent kernel.
-   "CLI" could mean runtime plugin loader or project file manager — resolved: **HackKit CLI** manages project creation and plugin-provided files, while **HackKit Core** remains the only current implementation target.
-   "Clerk ID" was used in the existing code as the user identifier — resolved: use **Auth ID** as the provider-neutral term.
-   "user" and "hacker" were used interchangeably in parts of the existing code — resolved: a **User** may exist without being a **Hacker**.
-   "hackerTag" in the existing code is being renamed — resolved: use **HackTag** because the handle can belong to any **User**, not only a **Hacker**.
-   Required MLH, demographic, and logistics fields were mixed into common user records — resolved: distinguish identity/profile fields on **User** from required **User Data**, while requiring **User Data** for every **User**.
-   "user registration form" could mean creating a **User** or collecting **User Data** — resolved: use **User Data form** for the form that collects required MLH, demographic, and logistics information.
-   "side event" describes agenda **Events** informally but must not appear in **HackKit UI** copy — resolved: user-facing language uses **Event** or schedule wording only.
-   Legacy `events.name` column stored the event title — resolved: HackKit Core uses domain property `title`.
-   Legacy `checkinTimestamp` on user records — resolved: **Hackathon Check-in** uses `checkedInAt` on **User** in HackKit Core.
-   Whether competitors are approved immediately or by organisers — resolved: **Require Approval** hackathon setting; when not required, final onboarding step sets `isApproved` true; when required, organisers approve via **Organiser Approval** workflow.
-   “Logging system” as persisted `error_log` rows vs framework logging — resolved: **HackKit Logger** pluggable boundary with **Log Level** and custom implementation; significant **HackKit Core** domain APIs, including **Hackathon Setting** changes, log through it without a separate audit table in v1.
-   Default **Log Level** when unset — resolved: `info` in development, `warn` in production (environment-based), overridable per **HackKit Web App**.
-   Runtime admin toggles (e.g. registration open/closed) — resolved: model them as typed **Hackathon Settings** owned by **HackKit Core**, not generic **HackKit Web App** preferences or an unstructured key/value store.
-   **Hackathon Setting** source of truth — resolved: a setting may have a built-in default, but its actual value must not be set from both static config and live admin-managed settings.
-   **Require Approval**, **Event Pass QR TTL**, **Maximum Registrations**, **Hackathon Capacity**, and whether new **Hacker Registration** is open are **Hackathon Settings**.
-   Default **Hackathon Settings** are: new **Hacker Registration** open, **Require Approval** off, existing **Event Pass QR TTL** default, **Maximum Registrations** unlimited, and **Hackathon Capacity** unlimited.
-   Changing **Hackathon Settings** requires the **Settings Management Permission**.
-   When new **Hacker Registration** is closed, **HackKit Core** rejects first-time **Hacker Registration** but does not reject **User Data** completion or updates to existing **Hacker Registration** records.
-   **Maximum Registrations** is enforced against first-time **Hacker Registration** by counting existing **Hackers**; volunteers and organisers who are not **Hackers** do not count toward this limit.
-   **Hackathon Capacity** is enforced against **Organiser Approval** by counting approved **Hackers**; volunteers and organisers who are not **Hackers** do not count toward this limit.
-   Lowering **Maximum Registrations** or **Hackathon Capacity** below the current count does not retroactively remove **Hackers** or revoke **Organiser Approval**; it blocks future registrations or approvals.
-   Admin experiences should surface when the current **Hacker** or approved **Hacker** count exceeds the configured **Maximum Registrations** or **Hackathon Capacity**.
-   Resume on **Hacker Registration** — resolved: optional `resumeUrl` only; no legacy “no resume provided” sentinel URL.
-   **Hacker** `group` assignment — resolved: **Group** is a HackKit participant cohort assigned at **Organiser Approval** time by round-robin distribution unless an organizer has already assigned one; it is separate from **Team** and may map to Discord roles through a plugin.
-   Default competitor **Role** on onboarding — resolved: applied when **Hacker Registration** completes, not at auth/`ensureUser` (legacy-aligned).
-   **Hacker** vs **User** for **Event Pass** could mean competitors only — resolved: attendance uses **Auth ID** for any **User**, matching the original HackKit convention that all participants share one identity record.
-   Legacy storage used one scan row per user and event with an incrementing count — resolved: HackKit Core stores each scan as a separate **Event Scan** row with its own identifier.

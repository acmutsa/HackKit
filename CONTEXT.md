# HackKit

HackKit is a toolkit for building hackathon management applications while keeping the reusable hackathon domain separate from any specific web implementation.

## Language

**HackKit Core**:
The framework-independent HackKit kernel that defines hackathon domain concepts and application use-cases behind stable APIs.
_Avoid_: Framework runtime, web app, Next app

**HackKit Web App**:
A fully built HackKit application that assembles UI, routes, and adapters into a working hackathon site.
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

**Blob Storage Adapter**:
An integration boundary that lets a HackKit Web App store files and pass resulting URLs or keys into HackKit Core.
_Avoid_: HackKit Core file system, attachment domain model

**User**:
An authenticated person who can use a HackKit application.
_Avoid_: Hacker, participant

**Hacker**:
A User who is competing in the hackathon and has competitor-specific registration data.
_Avoid_: User, attendee, organizer, judge

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
_Avoid_: Session timeout, auth token expiry, HackKit Core validation

**Event Pass QR**:
The encoded payload (including participant identity and issue time) presented as a scannable **Event Pass**. Encoding, parsing, and freshness checks are implemented in **HackKit UI**; the server mutation layer imports the same module to validate raw QR on confirm before calling **HackKit Core**.
_Avoid_: HackKit Core module, separate credential registry package

**Team**:
A competition group for **Hackers** with a unique **Team Tag**, owned by one **Team Owner**.
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

**Team Invite**:
A pending, accepted, or declined request for a **Hacker** to join a **Team**.
_Avoid_: RSVP, role assignment, email notification

**Hackathon Check-in**:
A one-time record that a **User** arrived and was checked in to the hackathon as a whole.
_Avoid_: **Event Scan**, RSVP

## Relationships

-   **HackKit Web App** depends on **HackKit Core** for hackathon behavior.
-   **HackKit UI** consumes **HackKit Core** APIs.
-   **HackKit UI** ships default schedule, **Event Pass**, volunteer scanner, and event admin components that **HackKit Web Apps** may replace individually without forking Core.
-   **HackKit CLI** creates projects that include a working **HackKit Web App**.
-   **HackKit CLI** manages project files provided by plugins.
-   **HackKit CLI** merges plugin-owned Next.js routes into a **HackKit Web App** using generated re-export stubs and records ownership in **hackkit.lock**.
-   **HackKit CLI** runs from a **HackKit Web App** project directory (not a monorepo root) and reads that app’s `hackkit.config.ts` for plugins and database settings.
-   A **HackKit Plugin** may add capabilities to a **HackKit Web App** without changing **HackKit Core** source.
-   **HackKit Core** receives **HackKit Plugins** through `createHackkit`.
-   **HackKit Plugins** should be configured in one place so package-specific integration details stay contained inside plugin packages.
-   **HackKit Plugins** expose storage schema contributions using **Storage Schema** without requiring every plugin to implement every database dialect.
-   **Storage Schema** can express field-level single-column references between plugin models and **HackKit Core** models.
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
-   A **User Data** onboarding flow may display the authenticated **User** while collecting **User Data**.
-   **HackKit UI** treats authenticated **User** information passed to forms as display context, not as authorization input.
-   A **Database Adapter** persists **HackKit Core** models using HackKit-owned canonical storage shapes.
-   The **Drizzle Database Adapter** targets SQLite/libSQL first while preserving room for future dialect support.
-   The **Drizzle Database Adapter** exposes dialect-specific entrypoints so each dialect can use native Drizzle schema definitions.
-   The **Drizzle Database Adapter** can generate concrete Drizzle schema from merged **Storage Schema** before full HackKit CLI migration tooling exists.
-   A **Blob Storage Adapter** stores files outside **HackKit Core**; **HackKit Core** stores only URLs or keys supplied by the **HackKit Web App**.
-   A **User** is identified by exactly one **Auth ID** in a HackKit application.
-   A **User** may have zero or one **Hacker** profile.
-   A **Hacker** belongs to exactly one **User**.
-   Organizers and judges are **Users** with **Roles**, not **Hackers**, unless they are also competing.
-   A **User** has one **Role** in v1.
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
-   **Hackathon Check-in** is separate from **Event Scan**; arriving at the venue is not the same as attending a specific **Event**.
-   **Hackathon Check-in** is recorded on the **User** as an optional arrival timestamp set by a volunteer with check-in permission.
-   A **User** may be **Hackathon Check-in** checked in at most once; repeat check-in attempts are rejected.
-   A volunteer with check-in permission may clear an existing **Hackathon Check-in** to correct a mistake.
-   **Event Types** constrain the type field on **Event** records and are shared by HackKit Core validation and HackKit UI rendering.
-   Each **Event Type** has a stable stored value, display label, and color, using the same value/label pattern as **User Data Options**.
-   **Event** records use string identifiers in HackKit Core.
-   Public schedule listing of non-hidden **Events** does not require an authenticated **User**; actors with `core.events.view` or higher can list hidden **Events** as well.
-   A **Team** belongs to the teams plugin domain and is composed of **Team Members** who must be **Hackers**.
-   Each **Hacker** may belong to at most one **Team** in v1.
-   Each **Team** has exactly one **Team Owner**, who is always a **Team Member**.
-   **Team Invites** are sent by the **Team Owner** and responded to by the invited **Hacker**.
-   **Team Invites** use pending, accepted, and declined statuses in v1.

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
-   **Hacker** vs **User** for **Event Pass** could mean competitors only — resolved: attendance uses **Auth ID** for any **User**, matching the original HackKit convention that all participants share one identity record.
-   Legacy storage used one scan row per user and event with an incrementing count — resolved: HackKit Core stores each scan as a separate **Event Scan** row with its own identifier.

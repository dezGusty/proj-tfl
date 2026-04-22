# TFL — Software Requirements Specification

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **TFL (Thursday Football League)** — a self-hosted web application for organising recreational football matches. TFL replaces a legacy Firebase-based Angular application ("team-balancer") with a new .NET + Angular stack while preserving all existing functionality and adding new capabilities.

### 1.2 Scope

TFL enables a small community of football players to:

- Maintain a rated player roster.
- Schedule game events and register participants.
- Generate balanced two-team lineups from registered players.
- Record match results and automatically adjust player ratings.
- Communicate with players via email and browser push notifications.
- Allow players to self-register and join upcoming events.

### 1.3 Definitions

| Term | Meaning |
|------|---------|
| **Player** | A person in the roster (may or may not be an app user). |
| **User** | A person with a login account in the system. |
| **Organizer** | A user role that can manage players, draft teams, and record results. |
| **Admin** | A user role with full access including settings and user management. |
| **Draft** | A working selection of players from the roster that will be split into two teams. |
| **Game Event** | A scheduled future match that players can register for. |
| **Match** | A completed game with recorded teams, scores, and rating changes. |
| **Rating** | A numeric score (range 4–10) representing a player's ability level. |

### 1.4 Technology Constraints

| Layer | Technology |
|-------|-----------|
| Back-end | .NET 10, ASP.NET Core Web API |
| Database | SQLite via Entity Framework Core |
| Front-end | Angular (latest stable) |
| Hosting | Self-hosted on Linux with a personal domain |
| Auth provider | Google OAuth 2.0 (via the .NET backend) |

---

## 2. User Roles & Authentication

### 2.1 Roles

The system defines three cumulative roles. A higher role implies the permissions of every lower role.

| Role | Description |
|------|-------------|
| **Standard** | Authenticated user. Can view players, matches, game events, and the draft. |
| **Organizer** | Can create/edit players, create game events, manage the draft, record match results, and manage custom games. |
| **Admin** | Can change application settings and manage users (approve, assign roles, revoke access). |

### 2.2 Authentication

| ID | Requirement |
|----|-------------|
| AUTH-1 | The system shall authenticate users via Google OAuth 2.0 handled by the .NET backend. |
| AUTH-2 | On successful authentication the backend shall issue a JWT that the front-end stores and sends with every API request. |
| AUTH-3 | The backend shall validate the JWT and extract the user's identity and roles on every protected endpoint. |
| AUTH-4 | Unauthenticated requests to protected endpoints shall receive HTTP 401. |
| AUTH-5 | Requests lacking the required role shall receive HTTP 403. |

### 2.3 User Registration & Approval

| ID | Requirement |
|----|-------------|
| REG-1 | When a user signs in with Google for the first time, a User record shall be created with `approved = false` and role = Standard. |
| REG-2 | An unapproved user shall not be able to access any protected resource (treated as unauthenticated). |
| REG-3 | An Admin shall be able to view pending (unapproved) users and approve or reject them. |
| REG-4 | An Admin shall be able to assign or revoke the Organizer and Admin roles for any approved user. |

---

## 3. Domain Entities

### 3.1 Player

Represents an individual in the football roster (not necessarily an app user).

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier. |
| name | string | Full name. |
| displayName | string | Short/nickname (optional, falls back to name). |
| rating | decimal | Current ability rating (expected range 4–10). |
| keywords | string | Search tokens for filtering. |
| affinity | integer | Team-lock hint for the balancing algorithm (0 = none). |
| stars | integer | Star/preference score used in game event context. |
| reserve | boolean | Whether the player is on the bench by default. |
| isArchived | boolean | Soft-delete flag. Archived players are hidden from default views. |
| mostRecentMatches | RecentEntry[] | Rolling window of recent match results (configurable length, default 8). |
| lastModified | datetime | System-managed timestamp updated on every write. Used for sync change detection. |

#### 3.1.1 RecentEntry

| Field | Type | Description |
|-------|------|-------------|
| date | string | ISO date of the match. |
| diff | decimal | Rating change resulting from the match. |
| type | enum? | `null` (normal match), `ignored`, `not_played`, `manual_edit`. |

### 3.2 User (AppUser)

| Field | Type | Description |
|-------|------|-------------|
| id | string/GUID | Internal identifier. |
| email | string | Google account email. |
| photoURL | string | Profile picture URL from Google. |
| roles | UserRoles | Role flags (standard, organizer, admin). |
| approved | boolean | Whether an admin has approved this account. |

### 3.3 AppSettings (singleton)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| autoSave | boolean | true | Auto-persist changes in game event editing. |
| defaultMatchSchedule | MatchDaySchedule[] | Tue 20:00, Thu 20:00 | Recurring match days/times. |
| showPlayerStatusIcons | boolean | true | Include star/reserve icons in clipboard exports. |
| autoNavigateToTransferredDraft | boolean | true | Navigate to draft view after transferring from game event. |
| randomizePlayerOrder | boolean | false | Shuffle player order in clipboard copies. |
| recentMatchesToStore | integer | 8 | Number of recent entries kept per player (range 4–12). |

#### 3.3.1 MatchDaySchedule

| Field | Type | Description |
|-------|------|-------------|
| dayOfWeek | integer | 0 = Sunday … 6 = Saturday. |
| time | string | 24-hour time string "HH:MM". |

### 3.4 Draft

A working set of players selected for the next match.

| Field | Type | Description |
|-------|------|-------------|
| players | Player[] | Ordered list of selected players. |
| lastModified | datetime | System-managed timestamp updated on every write. Used for sync change detection. |

### 3.5 GameEvent

A scheduled future match to which players can register.

| Field | Type | Description |
|-------|------|-------------|
| name | string (PK) | Derived from date + optional suffix, e.g. `2026-04-16_20:00`. |
| matchDate | string | ISO date of the event. |
| registeredPlayerIds | integer[] | IDs of registered players. |
| playerReserveStatus | boolean[] | Parallel array — reserve flag per registered player. |
| inactive | boolean | Whether the event has been deactivated. |
| matchStatus | MatchStatus | Current status of the resulting match. |
| lastModified | datetime | System-managed timestamp updated on every write. Used for sync change detection. |

#### 3.5.1 MatchStatus (enum)

| Value | Meaning |
|-------|---------|
| `unknown` | Upcoming or result not yet entered. |
| `valid` | Match played, result is valid for rating calculation. |
| `unbalanced` | Match played but deemed very unbalanced. |
| `not_played` | Match did not take place. |

### 3.6 Match

A completed (or upcoming) game with team compositions and result.

| Field | Type | Description |
|-------|------|-------------|
| dateKey | string (PK) | `YYYY-MM-DD` (with optional suffix for same-day matches). |
| team1 | Player[] | Players on team 1. |
| team2 | Player[] | Players on team 2. |
| scoreTeam1 | integer | Goals scored by team 1. |
| scoreTeam2 | integer | Goals scored by team 2. |
| savedResult | boolean | Whether the result has been persisted. |
| appliedResults | boolean | Whether rating adjustments have been applied. |
| postResults | {id, diff}[] | Per-player rating change records. |
| status | MatchStatus | Match validity status. |
| lastModified | datetime | System-managed timestamp updated on every write. Used for sync change detection. |

### 3.7 RatingSnapshot (archive)

| Field | Type | Description |
|-------|------|-------------|
| label | string | Human-readable snapshot label. |
| version | integer | Incrementing version number. |
| players | Player[] | Full player list at time of snapshot. |

### 3.8 GameEventIndex / MatchIndex

These documents exist in Firestore only as index/navigation helpers for the legacy Angular app. They are **not** imported as separate SQLite tables; instead, the sync service rebuilds them in Firestore as derived data after each sync (see §6).

### 3.9 SyncConflict

A record flagged during sync because the same entity was modified on both sides since the last successful sync.

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier. |
| entityType | enum | `Player`, `Match`, `GameEvent`, `Draft`. |
| entityKey | string | The primary key of the conflicted record (player ID, match dateKey, etc.). |
| sqliteSnapshot | json | The SQLite version of the record at conflict detection time. |
| firestoreSnapshot | json | The Firestore version of the record at conflict detection time. |
| detectedAt | datetime | When the conflict was detected. |

---

## 4. Functional Requirements

### 4.1 Player Management

| ID | Requirement |
|----|-------------|
| PLR-1 | An Organizer shall be able to create a new player by providing at minimum: name and rating. |
| PLR-2 | An Organizer shall be able to edit any player field (name, displayName, rating, keywords, affinity). |
| PLR-3 | An Organizer shall be able to archive a player (soft-delete). Archived players are excluded from default views and drafts. |
| PLR-4 | An Organizer shall be able to restore (unarchive) a previously archived player. |
| PLR-5 | A Standard user shall be able to view the full active player list with columns: ID, name, display name, rating, recent match indicators. |
| PLR-6 | The player list shall be sortable by any displayed column. |
| PLR-7 | The player list shall be filterable by a free-text search matching name, displayName, and keywords (multi-token AND logic). |
| PLR-8 | A Standard user shall be able to toggle visibility of archived players. |
| PLR-9 | Selecting a player shall display a detail panel with: all player fields, a rating history chart, and the recent match list with performance indicators. |
| PLR-10 | An Organizer shall be able to apply a manual rating adjustment to a player, recorded as a `manual_edit` entry in mostRecentMatches. |

### 4.2 Draft & Team Balancing

| ID | Requirement |
|----|-------------|
| DRF-1 | A Standard user shall be able to view the current draft (list of selected players). |
| DRF-2 | An Organizer shall be able to add or remove individual players to/from the draft. |
| DRF-3 | An Organizer shall be able to clear the entire draft. |
| DRF-4 | The system shall persist the draft so it survives page reloads and is shared across users. |
| DRF-5 | The draft view shall display two panels: selected players (left) and available players from the roster (right), with a search box. |
| DRF-6 | An Organizer shall be able to trigger team generation ("Match-up") from the current draft. |
| DRF-7 | The team balancing algorithm shall enumerate all possible equal-size two-team splits of the drafted players and rank them by total rating difference (ascending). |
| DRF-8 | The system shall display the top 20 most balanced combinations, each showing both teams with individual and total ratings. |
| DRF-9 | The algorithm shall respect player affinity constraints (force a player to a specific team side). |
| DRF-10 | An Organizer shall be able to copy the draft or a generated matchup to the clipboard in a plain-text format. |
| DRF-11 | An Organizer shall be able to export the selected players to a JSON file. |
| DRF-12 | The system shall offer shortcuts to generate combinations for the "top N" rated players (e.g. top 10, top 12). |

### 4.3 Game Events

| ID | Requirement |
|----|-------------|
| GEV-1 | An Organizer shall be able to create a game event by selecting a date and optional time suffix. |
| GEV-2 | The system shall suggest the next scheduled match day based on `defaultMatchSchedule` in AppSettings. |
| GEV-3 | A Standard user shall be able to view all active (non-inactive) game events. |
| GEV-4 | An Organizer shall be able to add or remove players from a game event's registered list. |
| GEV-5 | An Organizer shall be able to toggle the reserve status of a registered player within a game event. |
| GEV-6 | An Organizer shall be able to set a star rating on a registered player within a game event. |
| GEV-7 | An Organizer shall be able to randomize the order of registered players. |
| GEV-8 | When auto-save is enabled (AppSettings), changes to a game event shall be persisted immediately. |
| GEV-9 | An Organizer shall be able to mark a game event as inactive (deactivated). |
| GEV-10 | An Organizer shall be able to transfer registered players from a game event into the draft. |
| GEV-11 | A summary view shall display a matrix of all active game events (columns) × players (rows) showing registration and star/reserve status. |
| GEV-12 | The summary shall be copyable to the clipboard with formatting. |

### 4.4 Match Recording & History

| ID | Requirement |
|----|-------------|
| MAT-1 | An Organizer shall be able to store a match result: team compositions, score for each team, and match status. |
| MAT-2 | When a match result is saved with status `valid`, the system shall calculate per-player rating changes using the rating formula and apply them to the player roster. |
| MAT-3 | The rating formula shall use: `adjustment = fixedMultiplier (0.05) + goalDifferential × goalMultiplier (0.011)`. Winners gain, losers lose. |
| MAT-4 | Rating changes shall be recorded in each affected player's `mostRecentMatches` as a `RecentEntry`. |
| MAT-5 | The system shall maintain a rolling list of recent match keys (configurable length via `recentMatchesToStore`). |
| MAT-6 | A Standard user shall be able to browse recent matches, seeing date and status icon for each. |
| MAT-7 | A Standard user shall be able to view match details: teams, scores, per-player rating changes (colour-coded: green = gained, red = lost). |
| MAT-8 | An Organizer shall be able to update the status of a previously saved match (valid / unbalanced / not_played / unknown). |
| MAT-9 | When a match is marked `not_played`, the corresponding rating changes shall not be applied (or shall be reversed if previously applied). |

### 4.5 Application Settings

| ID | Requirement |
|----|-------------|
| SET-1 | An Admin shall be able to view and modify all application settings listed in §3.3. |
| SET-2 | Settings changes shall take effect immediately for all users. |
| SET-3 | The `recentMatchesToStore` value shall be clamped to the range [4, 12]. |

### 4.6 User Management (New)

| ID | Requirement |
|----|-------------|
| USR-1 | An Admin shall be able to view a list of all users with their email, roles, and approval status. |
| USR-2 | An Admin shall be able to approve or reject pending user registrations (see REG-3). |
| USR-3 | An Admin shall be able to assign or revoke Organizer and Admin roles per user. |
| USR-4 | An Admin shall be able to deactivate an approved user, revoking all access. |

### 4.7 Player Self-Registration & Self-Join (New)

| ID | Requirement |
|----|-------------|
| PSR-1 | An approved Standard user shall be able to link their account to an existing player record (by admin assignment or self-claim with admin approval). |
| PSR-2 | A user linked to a player shall be able to join or leave any active game event themselves, adding/removing their player ID from the registered list. |
| PSR-3 | Self-join/leave shall be subject to the same constraints as organizer-managed registration (e.g. event must be active). |

### 4.8 Email Notifications (New)

| ID | Requirement |
|----|-------------|
| EML-1 | The system shall be able to send email notifications via SMTP (configurable). |
| EML-2 | An Admin shall be able to manage an external mailing list (email addresses not tied to app users). |
| EML-3 | The system shall send an email when a new game event is created, to all opted-in app users and the external mailing list. |
| EML-4 | The system shall send an email when key game event data changes (e.g. event cancelled, date changed). |
| EML-5 | Users shall be able to opt in or out of email notifications. |

### 4.9 Browser Push Notifications (New)

| ID | Requirement |
|----|-------------|
| PSH-1 | The system shall implement Web Push (VAPID) notifications from the .NET backend — no Firebase dependency. |
| PSH-2 | Users shall be able to subscribe to push notifications from the front-end. |
| PSH-3 | The system shall store push subscriptions per user. |
| PSH-4 | A push notification shall be sent when: a new game event is available to join, a player joins or leaves an event, or an organizer makes a significant change. |
| PSH-5 | Users shall be able to unsubscribe from push notifications. |

### 4.10 Firebase Synchronisation (New)

| ID | Requirement |
|----|-------------|
| SYN-1 | The system shall support bidirectional sync between Firestore and SQLite for the following entity types: Player, Match, GameEvent, and Draft. |
| SYN-2 | AppSettings, AppUsers, and the Firestore index documents (`matches/recent`, `games/_list`) are excluded from bidirectional sync (see §6). |
| SYN-3 | An Admin shall be able to trigger a full sync covering all entity types. |
| SYN-4 | An Admin shall be able to trigger a partial sync for a single entity type. |
| SYN-5 | A sync operation shall read all relevant Firestore documents, compare them with the corresponding SQLite records, and propagate changes in both directions. |
| SYN-6 | For each synced entity the system shall compare the SQLite `lastModified` timestamp with the Firestore document `updateTime` to detect which side changed since the last sync. |
| SYN-7 | If a record was modified only on one side since the last sync, the system shall propagate that change to the other side. |
| SYN-8 | If a record was modified on both sides since the last sync, the system shall flag it as a `SyncConflict` and skip syncing that record. |
| SYN-9 | A conflicted record shall not be synced until an Admin resolves it. |
| SYN-10 | An Admin shall be able to resolve a conflict by selecting either the SQLite or the Firestore version as the canonical value; the chosen version shall then be written to both systems. |
| SYN-11 | After a sync, the system shall rebuild the Firestore index documents (`matches/recent` and `games/_list`) as derived data from the synced Match and GameEvent records, so that the legacy Angular app continues to function. |
| SYN-12 | A physical deletion in Firestore (document removed) shall be treated as a soft-delete in SQLite: the corresponding Player's `isArchived` flag shall be set to `true`; Match and GameEvent records shall have their status set to `not_played` / `inactive` respectively. |
| SYN-13 | The first sync against an empty SQLite database shall behave as a full bootstrap import from Firestore (equivalent to the former one-time migration). |
| SYN-14 | A sync operation shall be idempotent — running it multiple times with no intervening changes on either side shall produce no changes. |
| SYN-15 | The Admin sync page shall display: the timestamp of the last completed sync, the count of unresolved conflicts, and the result summary of the most recent sync run. |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-P1 | API responses shall complete within 500 ms for typical operations (data volumes are small: tens of players, dozens of matches). |
| NFR-P2 | The team balancing algorithm shall complete within 2 seconds for up to 20 players. |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| NFR-S1 | All API endpoints (except the OAuth callback and public health-check) shall require a valid JWT. |
| NFR-S2 | Role checks shall be enforced server-side; client-side guards are for UX only. |
| NFR-S3 | The application shall be served exclusively over HTTPS. |
| NFR-S4 | User passwords shall never be stored; authentication is delegated to Google OAuth. |
| NFR-S5 | CORS shall be configured to allow only the front-end origin. |
| NFR-S6 | The API shall validate and sanitize all input to prevent injection attacks. |

### 5.3 Reliability & Data Integrity

| ID | Requirement |
|----|-------------|
| NFR-R1 | The SQLite database file shall be included in a regular backup strategy (details outside this spec). |
| NFR-R2 | Rating updates from a match result shall be applied atomically — either all player ratings are updated or none. |

### 5.4 Deployment & Operations

| ID | Requirement |
|----|-------------|
| NFR-D1 | The application shall run on a single Linux host. |
| NFR-D2 | The backend shall be a single self-contained .NET process serving both the API and the Angular static files. |
| NFR-D3 | The system shall be accessible via a personal domain with HTTPS (e.g. via Let's Encrypt / reverse proxy). |
| NFR-D4 | The application shall support zero-downtime restarts (acceptable brief unavailability for a single-user-class app). |

### 5.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-M1 | The backend shall follow a layered architecture (API controllers → service layer → data access). |
| NFR-M2 | The Angular front-end shall use a service-based data layer so that the transport mechanism (HTTP) is isolated from component logic. |

---

## 6. Firebase Synchronisation

The new TFL application runs alongside the legacy Firebase Angular app during the transition period. A bidirectional sync service keeps Firestore and the SQLite database in agreement, allowing both applications to remain operational concurrently.

| ID | Requirement |
|----|-------------|
| SYN-1–SYN-15 | See §4.10 for the full list of sync functional requirements. |

### 6.1 Firestore Collection Mapping

| Firestore Path | SQLite Entity | Sync Direction | Notes |
|----------------|--------------|----------------|-------|
| `ratings/current` | Player (`isArchived = false`) | Bidirectional | |
| `ratings/archive` | Player (`isArchived = true`) | Bidirectional | |
| `drafts/next` | Draft | Bidirectional | |
| `matches/{dateKey}` | Match | Bidirectional | |
| `games/{name}` | GameEvent | Bidirectional | |
| `matches/recent` | _(derived)_ | Firestore write-only | Rebuilt from Match records after each sync; not stored as a SQLite entity. |
| `games/_list` | _(derived)_ | Firestore write-only | Rebuilt from GameEvent records after each sync; not stored as a SQLite entity. |
| `settings/app` | AppSettings | Not synced | Settings are managed exclusively in the new app. |
| `users/{uid}` | AppUser | Not synced | User/auth management is handled exclusively by the new app. |

---

## 7. API Surface (High-Level)

The following outlines the expected REST API resource structure. Detailed request/response schemas will be defined in the architecture document.

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/players` | Standard | List active players. |
| GET | `/api/players/archived` | Standard | List archived players. |
| POST | `/api/players` | Organizer | Create a new player. |
| PUT | `/api/players/{id}` | Organizer | Update a player. |
| PATCH | `/api/players/{id}/archive` | Organizer | Archive or unarchive a player. |
| PATCH | `/api/players/{id}/rating` | Organizer | Manual rating adjustment. |
| GET | `/api/draft` | Standard | Get current draft. |
| PUT | `/api/draft` | Organizer | Save / replace the draft. |
| POST | `/api/draft/generate-teams` | Standard | Run team balancing on given player IDs. |
| GET | `/api/game-events` | Standard | List active game events. |
| POST | `/api/game-events` | Organizer | Create a new game event. |
| GET | `/api/game-events/{name}` | Standard | Get game event details. |
| PUT | `/api/game-events/{name}` | Organizer | Update a game event. |
| POST | `/api/game-events/{name}/join` | Standard | Self-join a game event (linked player). |
| DELETE | `/api/game-events/{name}/join` | Standard | Self-leave a game event. |
| POST | `/api/game-events/{name}/transfer-to-draft` | Organizer | Transfer registrations into draft. |
| GET | `/api/game-events/summary` | Standard | Get the summary matrix. |
| GET | `/api/matches/recent` | Standard | List recent match keys + statuses. |
| GET | `/api/matches/{dateKey}` | Standard | Get match details. |
| POST | `/api/matches` | Organizer | Store a new match result. |
| PUT | `/api/matches/{dateKey}` | Organizer | Update match result / status. |
| GET | `/api/settings` | Admin | Get application settings. |
| PUT | `/api/settings` | Admin | Update application settings. |
| GET | `/api/users` | Admin | List all users. |
| PUT | `/api/users/{id}/approve` | Admin | Approve a pending user. |
| PUT | `/api/users/{id}/roles` | Admin | Assign roles to a user. |
| GET | `/api/auth/google` | Public | Initiate Google OAuth flow. |
| GET | `/api/auth/callback` | Public | OAuth callback, issues JWT. |
| POST | `/api/notifications/subscribe` | Standard | Register a push subscription. |
| DELETE | `/api/notifications/subscribe` | Standard | Unregister a push subscription. |
| GET | `/api/sync/status` | Admin | Get last sync timestamp, unresolved conflict count, and last run summary. |
| POST | `/api/sync` | Admin | Trigger a full sync (all entity types). |
| POST | `/api/sync/{entityType}` | Admin | Trigger a partial sync for one entity type (`players`, `matches`, `game-events`, `draft`). |
| GET | `/api/sync/conflicts` | Admin | List all unresolved `SyncConflict` records. |
| PUT | `/api/sync/conflicts/{id}/resolve` | Admin | Resolve a conflict by choosing `sqlite` or `firestore` as the canonical version. |

---

## 8. Front-End Feature Map

The Angular front-end shall provide the following views, mirroring the legacy application's feature set with the additions noted.

| Route | Component | Guard | Description |
|-------|-----------|-------|-------------|
| `/` | redirect | — | Redirects to `/about`. |
| `/about` | AboutPage | Public | App version and info. |
| `/signin` | SignInPage | Public | Google OAuth sign-in trigger. |
| `/privacy` | PrivacyPage | Public | Privacy policy. |
| `/players` | PlayerListPage | Standard | Player list with search, sort, archive toggle. |
| `/players/new` | PlayerEditPage | Organizer | Create new player form. |
| `/players/:id` | PlayerDetailPage | Standard | Player detail side-panel with rating chart. |
| `/players/:id/edit` | PlayerEditPage | Organizer | Edit player form. |
| `/nextdraft` | DraftPage | Standard | Two-panel draft builder with team generation. |
| `/custom` | CustomGamePage | Organizer | Ad-hoc team generator. |
| `/games` | GameEventsPage | Standard | Game event list, create form, summary. |
| `/games/:id` | GameEventDetailPage | Standard | Game event registration (add/remove players). |
| `/recent` | MatchHistoryPage | Standard | Recent matches list. |
| `/recent/:id` | MatchDetailPage | Standard | Match result detail with rating diffs. |
| `/admin` | AdminPage | Admin | Application settings. |
| `/admin/users` | UserManagementPage | Admin | User approval and role management (new). |
| `/admin/sync` | SyncPage | Admin | Firebase sync status, trigger controls, and conflict resolution UI (new). |

---

## 9. Out of Scope

The following items are explicitly **not** part of this specification:

- Facebook login (only Google OAuth is supported).
- Mobile native app (the web app should be responsive but is not a PWA with offline support).
- Tournament brackets, league standings, or multi-season tracking.
- Real-time collaborative editing (changes are per-request; no WebSocket-based live sync of views is required in v1).
- Automatic / real-time Firebase sync (sync is admin-triggered on demand; no continuous background replication).

---

## 10. Glossary of Identifiers

All requirement IDs follow this convention for traceability:

| Prefix | Area |
|--------|------|
| AUTH | Authentication |
| REG | Registration & approval |
| PLR | Player management |
| DRF | Draft & team balancing |
| GEV | Game events |
| MAT | Match recording & history |
| SET | Application settings |
| USR | User management |
| PSR | Player self-registration & self-join |
| EML | Email notifications |
| PSH | Push notifications |
| SYN | Firebase synchronisation |
| NFR | Non-functional requirements |


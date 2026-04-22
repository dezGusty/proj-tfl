# TFL — Architecture Document

> **Status:** Authoritative. All structural decisions recorded here are binding for implementation.
> **Companion document:** `docs/tfl-requirements.md` (functional requirements and requirement IDs).

---

## Table of Contents

1. [System Context](#1-system-context)
2. [Repository Layout](#2-repository-layout)
3. [Backend Solution Structure](#3-backend-solution-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication Flow](#5-authentication-flow)
6. [Team Balancing Algorithm](#6-team-balancing-algorithm)
7. [Rating Formula](#7-rating-formula)
8. [Firebase Sync Architecture](#8-firebase-sync-architecture)
9. [API Endpoint Reference](#9-api-endpoint-reference)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Testing Strategy](#12-testing-strategy)

---

## 1. System Context

TFL replaces the legacy Firebase Angular app ("team-balancer") with a .NET 10 + Angular stack. **During the transition period both applications run concurrently** against the same Firestore database. A manual, admin-triggered bidirectional sync keeps SQLite and Firestore in agreement.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser                                                            │
│  ┌────────────────────┐   ┌─────────────────────────────────────┐  │
│  │  TFL Angular SPA   │   │  Legacy team-balancer Angular app   │  │
│  └────────┬───────────┘   └──────────────┬──────────────────────┘  │
└───────────┼──────────────────────────────┼─────────────────────────┘
            │ HTTPS/REST                   │ HTTPS/Firestore SDK
            ▼                              ▼
┌───────────────────────┐       ┌──────────────────────┐
│  TFL .NET 10 API      │       │  Google Firestore    │
│  (ASP.NET Core)       │◄─────►│  (teams-balancer)    │
│                       │ sync  └──────────────────────┘
│  ┌─────────────────┐  │
│  │  SQLite (EF     │  │       ┌──────────────────────┐
│  │  Core)          │  │       │  Google OAuth 2.0    │
│  └─────────────────┘  │◄─────►│  (accounts.google)   │
│                       │ auth  └──────────────────────┘
│                       │
│                       │       ┌──────────────────────┐
│                       │──────►│  SMTP Server         │
│                       │ email └──────────────────────┘
│                       │
│                       │       ┌──────────────────────┐
│                       │──────►│  Web Push Service    │
│                       │ push  │  (FCM/Mozilla/etc.)  │
└───────────────────────┘       └──────────────────────┘
```

**Key constraint:** the legacy app reads `matches/recent` and `games/_list` as Firestore index documents. The sync service must rebuild these after every sync so the legacy app continues to work.

---

## 2. Repository Layout

```
proj-tfl/                          ← repository root
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── tfl-requirements.md
│   └── tfl-architecture.md        ← this file
├── team-balancer/                 ← legacy Angular app (read-only during transition)
├── tfl-backend/                   ← NEW: .NET solution
│   ├── TFL.sln
│   ├── src/
│   │   ├── TFL.Domain/            ← no external NuGet dependencies
│   │   │   └── TFL.Domain.csproj
│   │   ├── TFL.Application/       ← depends on TFL.Domain
│   │   │   └── TFL.Application.csproj
│   │   ├── TFL.Infrastructure/    ← depends on TFL.Application + TFL.Domain
│   │   │   └── TFL.Infrastructure.csproj
│   │   └── TFL.API/               ← depends on all; ASP.NET Core host
│   │       ├── TFL.API.csproj
│   │       ├── Program.cs
│   │       ├── appsettings.json
│   │       └── appsettings.Production.json
│   └── tests/
│       └── TFL.Tests.Unit/
│           └── TFL.Tests.Unit.csproj
└── tfl-frontend/                  ← NEW: Angular application
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── app/
            ├── core/
            ├── features/
            └── shared/
```

The Angular build output (`dist/`) is placed into `tfl-backend/src/TFL.API/wwwroot/` so the .NET host serves both API and static files from a single process (NFR-D2).

---

## 3. Backend Solution Structure

### 3.1 Dependency Rule

```
TFL.Domain  ◄──  TFL.Application  ◄──  TFL.Infrastructure
                                   ◄──  TFL.API
```

No project may reference a project further right in the chain. `TFL.Infrastructure` and `TFL.API` both depend on `TFL.Application`. `TFL.API` wires everything together via dependency injection.

### 3.2 TFL.Domain

Contains entities, value objects, and enums only. **Zero NuGet dependencies.**

#### Entities

| Class | Notes |
|-------|-------|
| `Player` | Active or archived roster member. |
| `PlayerRecentEntry` | One entry in a player's rolling match history. |
| `Match` | Completed match with team compositions, scores, and results. |
| `MatchPlayer` | Join entity: match ↔ player, with team side and rating diff. |
| `GameEvent` | Scheduled future match. |
| `GameEventRegistration` | Join entity: game event ↔ player, with reserve and stars. |
| `Draft` | Singleton working set. Always `Id = 1`. |
| `DraftPlayer` | Join entity: draft ↔ player, with sort order. |
| `AppUser` | Authenticated user account. |
| `AppSettings` | Singleton application settings. Always `Id = 1`. |
| `MatchDaySchedule` | Value object: one recurring match day/time. |
| `SyncConflict` | A sync conflict record awaiting admin resolution. |
| `SyncState` | Singleton-per-entity-type sync checkpoint. |
| `RatingSnapshot` | Archived player roster snapshot. |
| `PushSubscription` | Web Push endpoint + keys per user. |
| `ExternalMailEntry` | Mailing list address not tied to an app user. |

#### Enums

```csharp
// MatchStatus.cs
public enum MatchStatus { Unknown = 0, Valid = 1, Unbalanced = 2, NotPlayed = 3 }

// UserRole.cs — bitmask; roles are cumulative (Admin implies Organizer implies Standard)
[Flags]
public enum UserRole { None = 0, Standard = 1, Organizer = 2, Admin = 4 }

// SyncEntityType.cs
public enum SyncEntityType { Players, Matches, GameEvents, Draft }

// RecentEntryType.cs
public enum RecentEntryType { Normal = 0, Ignored = 1, NotPlayed = 2, ManualEdit = 3 }
```

### 3.3 TFL.Application

Contains service classes (business logic) and interfaces. Depends only on `TFL.Domain`.

#### Repository Interfaces (`Interfaces/Repositories/`)

| Interface | Purpose |
|-----------|---------|
| `IPlayerRepository` | CRUD + search/filter for players. |
| `IMatchRepository` | CRUD for matches and match-players. |
| `IGameEventRepository` | CRUD for game events and registrations. |
| `IDraftRepository` | Get/replace the singleton draft. |
| `IAppUserRepository` | User lookup, upsert, role and approval management. |
| `IAppSettingsRepository` | Get/update the singleton settings. |
| `ISyncConflictRepository` | Create, list, delete, and resolve conflicts. |
| `ISyncStateRepository` | Get/set the last-sync timestamp per entity type. |
| `IPushSubscriptionRepository` | CRUD for push subscriptions. |
| `IExternalMailRepository` | CRUD for the external mailing list. |
| `IRatingSnapshotRepository` | Create and list rating snapshots. |

#### External Service Interfaces (`Interfaces/`)

| Interface | Purpose |
|-----------|---------|
| `IFirestoreClient` | Read/write Firestore documents. Abstracts `Google.Cloud.Firestore`. |
| `IEmailService` | Send emails via SMTP. |
| `IPushService` | Send Web Push notifications via VAPID. |

#### Service Classes (`Services/`)

| Class | Key Responsibilities |
|-------|----------------------|
| `PlayerService` | Player CRUD, archive/unarchive, manual rating adjustment. |
| `MatchService` | Store match result, apply/reverse rating changes (calls `RatingService`), status updates. |
| `GameEventService` | CRUD for game events, registration management, summary matrix, draft transfer. |
| `DraftService` | Get/replace draft, team generation (calls `TeamBalancingService`). |
| `TeamBalancingService` | Pure combinatorics: enumerate splits, apply affinity, sort, return top 20. |
| `RatingService` | Calculate per-player adjustments, update players in a transaction, maintain rolling recent-match window. |
| `SyncService` | Bidirectional Firestore ↔ SQLite sync (see §8). |
| `AuthService` | Google OAuth exchange, AppUser upsert, JWT issuance. |
| `NotificationService` | Orchestrate email + push sends based on domain events. |
| `SettingsService` | Get/update AppSettings. |

### 3.4 TFL.Infrastructure

Implements all interfaces defined in `TFL.Application`.

#### NuGet Packages

| Package | Purpose |
|---------|---------|
| `Microsoft.EntityFrameworkCore.Sqlite` | ORM + SQLite driver. |
| `Microsoft.EntityFrameworkCore.Design` | EF Core tooling support. |
| `Google.Cloud.Firestore` | Firestore client (preferred over `FirebaseAdmin`: directly exposes `DocumentSnapshot.UpdateTime`, required for sync conflict detection). |
| `MailKit` | SMTP email via `MimeKit` messages. |
| `WebPush` | VAPID Web Push notification sending. |

#### Structure

```
TFL.Infrastructure/
├── Data/
│   ├── TflDbContext.cs
│   ├── Configurations/          ← IEntityTypeConfiguration<T> per entity
│   │   ├── PlayerConfiguration.cs
│   │   ├── MatchConfiguration.cs
│   │   └── ...
│   ├── Migrations/              ← generated by `dotnet ef migrations add`
│   └── Repositories/            ← EF Core implementations of repository interfaces
├── Firebase/
│   └── FirestoreClient.cs
├── Email/
│   └── SmtpEmailService.cs
└── Push/
    └── VapidPushService.cs
```

Migrations are applied automatically on startup:
```csharp
// In Program.cs
await app.Services.GetRequiredService<TflDbContext>().Database.MigrateAsync();
```

### 3.5 TFL.API

#### NuGet Packages

| Package | Purpose |
|---------|---------|
| `Serilog.AspNetCore` | Structured logging. |
| `Serilog.Sinks.File` | Rolling file sink. |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT Bearer middleware. |
| `System.IdentityModel.Tokens.Jwt` | JWT generation (no ASP.NET Core Identity). |

#### Structure

```
TFL.API/
├── Controllers/
│   ├── PlayersController.cs
│   ├── DraftController.cs
│   ├── GameEventsController.cs
│   ├── MatchesController.cs
│   ├── SettingsController.cs
│   ├── UsersController.cs
│   ├── AuthController.cs
│   ├── NotificationsController.cs
│   └── SyncController.cs
├── Middleware/
│   └── ExceptionMiddleware.cs   ← catches unhandled exceptions → ProblemDetails
├── Program.cs
├── appsettings.json
└── appsettings.Production.json  ← secrets/paths via env vars or file override
```

#### Program.cs Wiring Order

```csharp
// 1. Serilog
Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(builder.Configuration).CreateLogger();
builder.Host.UseSerilog();

// 2. Services
builder.Services.AddDbContext<TflDbContext>(...);
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
// ... all repositories ...
builder.Services.AddScoped<PlayerService>();
// ... all services ...
builder.Services.AddSingleton<IFirestoreClient, FirestoreClient>();
builder.Services.AddSingleton<IEmailService, SmtpEmailService>();
builder.Services.AddSingleton<IPushService, VapidPushService>();

// 3. JWT Bearer Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* validate issuer, audience, signing key */ });

// 4. Authorization policies
builder.Services.AddAuthorization(options => {
    options.AddPolicy("Standard",  p => p.RequireClaim("roles", "standard"));
    options.AddPolicy("Organizer", p => p.RequireClaim("roles", "organizer"));
    options.AddPolicy("Admin",     p => p.RequireClaim("roles", "admin"));
});

// 5. CORS
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(p => p.WithOrigins(config["Cors:AllowedOrigin"])
        .AllowAnyHeader().AllowAnyMethod()));

// 6. Controllers + ProblemDetails
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

var app = builder.Build();

// 7. Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors();
app.UseStaticFiles();  // serves Angular from wwwroot
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");  // SPA fallback

// 8. Apply pending migrations
await using var scope = app.Services.CreateAsyncScope();
await scope.ServiceProvider.GetRequiredService<TflDbContext>().Database.MigrateAsync();

await app.RunAsync();
```

#### appsettings.json Shape

```json
{
  "Jwt": {
    "Secret": "<min-32-char-random-string>",
    "Issuer": "tfl-api",
    "Audience": "tfl-frontend",
    "ExpiryHours": 8
  },
  "Google": {
    "ClientId": "",
    "ClientSecret": "",
    "RedirectUri": "https://tfl.example.com/api/auth/callback"
  },
  "Database": {
    "Path": "/var/tfl/data/tfl.db"
  },
  "Firestore": {
    "ProjectId": "teams-balancer",
    "ServiceAccountKeyPath": "/var/tfl/secrets/firestore-key.json"
  },
  "Smtp": {
    "Host": "",
    "Port": 587,
    "Username": "",
    "Password": "",
    "FromAddress": "tfl@example.com",
    "FromName": "TFL"
  },
  "Vapid": {
    "PublicKey": "",
    "PrivateKey": "",
    "Subject": "mailto:admin@example.com"
  },
  "Cors": {
    "AllowedOrigin": "https://tfl.example.com"
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      { "Name": "File", "Args": { "path": "/var/tfl/logs/tfl-.log", "rollingInterval": "Day" } }
    ]
  }
}
```

#### Error Handling

`ExceptionMiddleware` catches all unhandled exceptions and returns RFC 7807 `ProblemDetails`. Validation errors from controller model binding return `400 Bad Request` with `ProblemDetails` automatically via `AddProblemDetails()`. All error responses use `Content-Type: application/problem+json`.

#### Controller Authorization Pattern

```csharp
[ApiController]
[Route("api/players")]
[Authorize(Policy = "Standard")]          // default for read actions
public class PlayersController : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = "Organizer")]     // override for write actions
    public async Task<IActionResult> Create(...) { ... }
}
```

Unapproved users: the JWT payload includes `"approved": true/false`. The `Standard` policy additionally requires the `approved` claim to be `"true"`. An unapproved user receives **HTTP 401** on all protected endpoints (REG-2). After an admin approves a user, the user must re-authenticate to get a new JWT containing `approved=true`.

---

## 4. Database Schema

SQLite, managed by EF Core. All boolean columns are stored as `INTEGER (0/1)`. All datetime columns are stored as `TEXT` in ISO 8601 UTC format (`YYYY-MM-DDTHH:MM:SS.fffZ`). All JSON columns are stored as `TEXT`.

### 4.1 Players

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `Name` | TEXT | NOT NULL |
| `DisplayName` | TEXT | NULL |
| `Rating` | REAL | NOT NULL |
| `Keywords` | TEXT | NULL |
| `Affinity` | INTEGER | NOT NULL DEFAULT 0 |
| `Stars` | INTEGER | NOT NULL DEFAULT 0 |
| `Reserve` | INTEGER | NOT NULL DEFAULT 0 |
| `IsArchived` | INTEGER | NOT NULL DEFAULT 0 |
| `LastModified` | TEXT | NOT NULL |
| `LinkedUserId` | TEXT | NULL, FK → AppUsers.Id |

**Indexes:** `IX_Players_IsArchived`, `IX_Players_LastModified`

### 4.2 PlayerRecentEntries

Normalized rolling window of a player's recent match history. Ordered by `SortOrder` ascending (0 = oldest).

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `PlayerId` | INTEGER | NOT NULL, FK → Players.Id ON DELETE CASCADE |
| `MatchDate` | TEXT | NOT NULL |
| `Diff` | REAL | NOT NULL |
| `EntryType` | INTEGER | NOT NULL DEFAULT 0 (RecentEntryType enum) |
| `SortOrder` | INTEGER | NOT NULL |

**Indexes:** `IX_PlayerRecentEntries_PlayerId`

### 4.3 Matches

| Column | Type | Constraints |
|--------|------|-------------|
| `DateKey` | TEXT | PRIMARY KEY (e.g. `2026-04-17` or `2026-04-17_2`) |
| `ScoreTeam1` | INTEGER | NOT NULL DEFAULT 0 |
| `ScoreTeam2` | INTEGER | NOT NULL DEFAULT 0 |
| `SavedResult` | INTEGER | NOT NULL DEFAULT 0 |
| `AppliedResults` | INTEGER | NOT NULL DEFAULT 0 |
| `Status` | INTEGER | NOT NULL DEFAULT 0 (MatchStatus enum) |
| `LastModified` | TEXT | NOT NULL |

**Indexes:** `IX_Matches_LastModified`, `IX_Matches_Status`

### 4.4 MatchPlayers

Join table: match ↔ player. Replaces the Firestore `team1[]` / `team2[]` / `postResults[]` arrays.

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `MatchDateKey` | TEXT | NOT NULL, FK → Matches.DateKey ON DELETE CASCADE |
| `PlayerId` | INTEGER | NOT NULL, FK → Players.Id |
| `Team` | INTEGER | NOT NULL (1 or 2) |
| `RatingDiff` | REAL | NULL (null before results are applied) |

**Unique index:** `UX_MatchPlayers_MatchDateKey_PlayerId`

### 4.5 GameEvents

| Column | Type | Constraints |
|--------|------|-------------|
| `Name` | TEXT | PRIMARY KEY (e.g. `2026-04-24_20:00`) |
| `MatchDate` | TEXT | NOT NULL |
| `Inactive` | INTEGER | NOT NULL DEFAULT 0 |
| `MatchStatus` | INTEGER | NOT NULL DEFAULT 0 |
| `LastModified` | TEXT | NOT NULL |

**Indexes:** `IX_GameEvents_Inactive`, `IX_GameEvents_MatchDate`

### 4.6 GameEventRegistrations

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `GameEventName` | TEXT | NOT NULL, FK → GameEvents.Name ON DELETE CASCADE |
| `PlayerId` | INTEGER | NOT NULL, FK → Players.Id |
| `IsReserve` | INTEGER | NOT NULL DEFAULT 0 |
| `Stars` | INTEGER | NOT NULL DEFAULT 0 |
| `SortOrder` | INTEGER | NOT NULL DEFAULT 0 |

**Unique index:** `UX_GameEventRegistrations_EventName_PlayerId`

### 4.7 Draft

Singleton; always `Id = 1`.

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY (always 1) |
| `LastModified` | TEXT | NOT NULL |

### 4.8 DraftPlayers

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `DraftId` | INTEGER | NOT NULL, FK → Draft.Id ON DELETE CASCADE |
| `PlayerId` | INTEGER | NOT NULL, FK → Players.Id |
| `SortOrder` | INTEGER | NOT NULL |

**Unique index:** `UX_DraftPlayers_DraftId_PlayerId`

### 4.9 AppSettings

Singleton; always `Id = 1`.

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY (always 1) |
| `AutoSave` | INTEGER | NOT NULL DEFAULT 1 |
| `ShowPlayerStatusIcons` | INTEGER | NOT NULL DEFAULT 1 |
| `AutoNavigateToTransferredDraft` | INTEGER | NOT NULL DEFAULT 1 |
| `RandomizePlayerOrder` | INTEGER | NOT NULL DEFAULT 0 |
| `RecentMatchesToStore` | INTEGER | NOT NULL DEFAULT 8 |
| `DefaultMatchSchedule` | TEXT | NOT NULL DEFAULT `'[{"dayOfWeek":2,"time":"20:00"},{"dayOfWeek":4,"time":"20:00"}]'` |

### 4.10 AppUsers

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | TEXT | PRIMARY KEY (GUID string) |
| `Email` | TEXT | NOT NULL UNIQUE |
| `PhotoUrl` | TEXT | NULL |
| `Roles` | INTEGER | NOT NULL DEFAULT 1 (UserRole bitmask) |
| `Approved` | INTEGER | NOT NULL DEFAULT 0 |
| `IsActive` | INTEGER | NOT NULL DEFAULT 1 |
| `LinkedPlayerId` | INTEGER | NULL, FK → Players.Id |

**Indexes:** `IX_AppUsers_Email`

### 4.11 SyncState

One row per `SyncEntityType`. Stores the last successful sync timestamp and a JSON summary of the last run.

| Column | Type | Constraints |
|--------|------|-------------|
| `EntityType` | TEXT | PRIMARY KEY (`'Players'`, `'Matches'`, `'GameEvents'`, `'Draft'`) |
| `LastSyncAt` | TEXT | NULL (ISO 8601 UTC; null = never synced) |
| `LastRunSummary` | TEXT | NULL (JSON; see §8 for shape) |

### 4.12 SyncConflicts

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `EntityType` | TEXT | NOT NULL |
| `EntityKey` | TEXT | NOT NULL |
| `SqliteSnapshot` | TEXT | NOT NULL (JSON) |
| `FirestoreSnapshot` | TEXT | NOT NULL (JSON) |
| `DetectedAt` | TEXT | NOT NULL |

**Unique index:** `UX_SyncConflicts_EntityType_EntityKey` (only one open conflict per record)

### 4.13 RatingSnapshots

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `Label` | TEXT | NOT NULL |
| `Version` | INTEGER | NOT NULL |
| `PlayersJson` | TEXT | NOT NULL |
| `CreatedAt` | TEXT | NOT NULL |

### 4.14 PushSubscriptions

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `UserId` | TEXT | NOT NULL, FK → AppUsers.Id ON DELETE CASCADE |
| `Endpoint` | TEXT | NOT NULL UNIQUE |
| `P256dh` | TEXT | NOT NULL |
| `Auth` | TEXT | NOT NULL |

### 4.15 ExternalMailList

| Column | Type | Constraints |
|--------|------|-------------|
| `Id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `Email` | TEXT | NOT NULL UNIQUE |
| `Active` | INTEGER | NOT NULL DEFAULT 1 |

---

## 5. Authentication Flow

Requirements: AUTH-1 through AUTH-5, REG-1 through REG-4.

### 5.1 Sign-In Flow

```
User                  Angular SPA              TFL API              Google OAuth
 │                        │                       │                      │
 │  Click "Sign In"        │                       │                      │
 │───────────────────────►│                       │                      │
 │                        │  GET /api/auth/google  │                      │
 │                        │──────────────────────►│                      │
 │                        │                       │ Generate state nonce  │
 │                        │                       │ Store in signed cookie│
 │                        │  302 → Google OAuth   │                      │
 │                        │◄──────────────────────│                      │
 │◄───────────────────────│                       │                      │
 │  Follow redirect        │                       │                      │
 │────────────────────────────────────────────────────────────────────►│
 │  Authenticate with Google                                            │
 │◄───────────────────────────────────────────────────────────────────│
 │  302 → /api/auth/callback?code=...&state=...                        │
 │────────────────────────────────────────────────►│                  │
 │                        │                        │ Validate state nonce │
 │                        │                        │ Exchange code → tokens
 │                        │                        │ Validate id_token     │
 │                        │                        │ Upsert AppUser        │
 │                        │                        │ Issue JWT             │
 │                        │  302 → /?token=<jwt>   │                      │
 │◄───────────────────────────────────────────────│                      │
 │  Angular stores token  │                        │                      │
 │  in localStorage       │                        │                      │
```

### 5.2 State Nonce (CSRF Protection)

The state nonce is a cryptographically random 32-byte value. It is stored as a short-lived `HttpOnly, Secure, SameSite=Lax` cookie (`tfl_oauth_state`) with `MaxAge = 5 minutes`. On callback, the nonce from the query param is compared to the cookie value; mismatch → 400.

### 5.3 JWT Payload

```json
{
  "sub":      "550e8400-e29b-41d4-a716-446655440000",
  "email":    "user@example.com",
  "roles":    ["standard", "organizer"],
  "approved": "true",
  "iat":      1713384000,
  "exp":      1713412800
}
```

- `roles` is a **multi-value claim** (one claim per role). In .NET, `RequireClaim("roles", "organizer")` checks for presence.
- `approved` is a string claim `"true"` or `"false"`. The `Standard` policy requires `approved = "true"`.
- JWT signed with **HMAC-SHA256** using the secret from `Jwt:Secret`.
- Expiry: **8 hours** from issuance.

### 5.4 Role Bitmask → JWT Roles Mapping

| UserRole bitmask | JWT `roles` array |
|------------------|-------------------|
| `Standard (1)` | `["standard"]` |
| `Organizer (3 = 1\|2)` | `["standard", "organizer"]` |
| `Admin (7 = 1\|2\|4)` | `["standard", "organizer", "admin"]` |

### 5.5 Angular HTTP Interceptor

A functional HTTP interceptor (`authInterceptor`) attaches `Authorization: Bearer <token>` to every outgoing request. It reads the token from `localStorage`. If the token is missing or expired (check `exp` claim), it redirects to `/signin`.

---

## 6. Team Balancing Algorithm

Requirements: DRF-6 through DRF-9, DRF-12. NFR-P2 (complete in ≤ 2 s for ≤ 20 players).

### 6.1 Algorithm

`TeamBalancingService.GenerateCombinations(playerIds, affinityOverrides)`:

1. **Load players** from the database by the given IDs.
2. **Separate by affinity:** players with `affinity = 1` are locked to team 1; `affinity = 2` locked to team 2; `affinity = 0` are free.
3. **Validate:** if locked-team-1 count + min-free/2 > total/2 (or vice-versa), return an empty list (constraints unsatisfiable).
4. **Enumerate splits:** Let `free` = players with no affinity. Required free on team 1 = `(total/2) - lockedTeam1Count`. Enumerate all `C(free.Count, requiredFreeOnTeam1)` subsets of free players for team 1. For odd total, team 1 gets `floor(total/2)` players.
5. **Calculate diff** for each combination: `|sum(team1.Rating) - sum(team2.Rating)|`.
6. **Sort** ascending by diff.
7. **Return top 20** combinations.

### 6.2 Complexity

For n = 20 (worst case, all free): `C(20, 10) = 184,756` iterations. Each iteration sums 10 ratings → ~1.8M float additions. Well within 2 s on modern hardware.

### 6.3 Response Shape

Each `TeamCombination` in the response:

```json
{
  "rank": 1,
  "team1": [
    { "id": 1, "name": "Alice", "displayName": "Ali", "rating": 7.5 }
  ],
  "team2": [
    { "id": 2, "name": "Bob", "displayName": null, "rating": 7.4 }
  ],
  "team1TotalRating": 37.5,
  "team2TotalRating": 37.4,
  "ratingDiffAbs": 0.1
}
```

---

## 7. Rating Formula

Requirements: MAT-2 through MAT-5, MAT-9, NFR-R2.

### 7.1 Formula

```
goalDiff   = abs(scoreTeam1 - scoreTeam2)
adjustment = 0.05 + goalDiff × 0.011

winner player: newRating = currentRating + adjustment
loser  player: newRating = currentRating - adjustment
```

Rating changes are only applied when `Match.Status = Valid`. For `NotPlayed`, no changes are applied (or existing changes are reversed). For `Unbalanced`, changes are applied normally (the status is informational only).

### 7.2 Application (RatingService)

`RatingService.ApplyMatchResult(match, settings)`:

1. Calculate `adjustment` from the formula.
2. Determine winners (higher-scoring team) and losers.
3. Within a **single EF Core transaction** (NFR-R2):
   a. For each player in the match: update `Player.Rating` and set `Player.LastModified = UtcNow`.
   b. Append a `PlayerRecentEntry` with `MatchDate`, `Diff` (+/−adjustment), `EntryType = Normal`.
   c. If `Player.PlayerRecentEntries.Count > settings.RecentMatchesToStore`, delete the entry with the lowest `SortOrder`.
   d. Set `Match.AppliedResults = true` and `Match.LastModified = UtcNow`.
4. Save all changes atomically.

### 7.3 Reversal (on NotPlayed status change)

`RatingService.ReverseMatchResult(match, settings)`:

1. Find all `MatchPlayer` records for the match.
2. Within a **single EF Core transaction**:
   a. For each player: subtract the stored `RatingDiff` from their current rating.
   b. Delete the corresponding `PlayerRecentEntry` for this match date.
   c. Set `Match.AppliedResults = false` and `Match.LastModified = UtcNow`.

---

## 8. Firebase Sync Architecture

Requirements: SYN-1 through SYN-15. Firebase project: `teams-balancer`.

### 8.1 Firestore Document Structure (for reference)

| Firestore Path | Sync Direction | SQLite Target |
|----------------|----------------|---------------|
| `ratings/current` (document with player map) | Bidirectional | Players (IsArchived=0) |
| `ratings/archive` (document with player map) | Bidirectional | Players (IsArchived=1) |
| `drafts/next` | Bidirectional | Draft + DraftPlayers |
| `matches/{dateKey}` | Bidirectional | Matches + MatchPlayers |
| `games/{name}` | Bidirectional | GameEvents + GameEventRegistrations |
| `matches/recent` | Firestore write-only (derived) | — |
| `games/_list` | Firestore write-only (derived) | — |

### 8.2 SyncState Table Usage

Before each sync run for an entity type, `SyncService` reads `SyncState.LastSyncAt` for that type. After a successful run it updates `LastSyncAt = UtcNow` and stores `LastRunSummary` (JSON).

`LastRunSummary` JSON shape:
```json
{
  "created": 2,
  "updated": 1,
  "skipped": 10,
  "conflicts": 1,
  "softDeleted": 0,
  "durationMs": 3214
}
```

### 8.3 Sync Algorithm (per entity type)

`SyncService.SyncEntityType(entityType, lastSyncAt)`:

**Step 1: Fetch both sides**
- Fetch all Firestore documents for the entity type collection.
- Fetch all SQLite records for the entity type (including archived/inactive).

**Step 2: Build key union**
- Create a union of all keys from both sides.

**Step 3: Process each key** (the 6-case merge):

| Case | Condition | Action |
|------|-----------|--------|
| **1 — Firestore only** | Key exists in Firestore, not in SQLite | Create SQLite record from Firestore data. Set `SQLite.LastModified = Firestore.UpdateTime`. |
| **2 — SQLite only (first sync or new record)** | Key exists in SQLite, not in Firestore, AND `lastSyncAt` is null OR `SQLite.LastModified > lastSyncAt` | Create Firestore document from SQLite data. |
| **3 — Deleted in Firestore (after prior sync)** | Key exists in SQLite, not in Firestore, AND `SQLite.LastModified <= lastSyncAt` | Apply soft-delete in SQLite (Player: `IsArchived=true`; GameEvent: `Inactive=true`; Match: `Status=NotPlayed`). |
| **4 — Unchanged on both sides** | Both exist AND `Firestore.UpdateTime <= lastSyncAt` AND `SQLite.LastModified <= lastSyncAt` | Skip (increment `skipped` counter). |
| **5 — Firestore changed only** | Both exist AND `Firestore.UpdateTime > lastSyncAt` AND `SQLite.LastModified <= lastSyncAt` | Update SQLite from Firestore. Set `SQLite.LastModified = Firestore.UpdateTime`. |
| **6 — SQLite changed only** | Both exist AND `SQLite.LastModified > lastSyncAt` AND `Firestore.UpdateTime <= lastSyncAt` | Update Firestore from SQLite. |
| **7 — Conflict (both changed)** | Both exist AND `Firestore.UpdateTime > lastSyncAt` AND `SQLite.LastModified > lastSyncAt` | Create (or update) a `SyncConflict` record. Skip the record. |

> **Bootstrap (first sync):** When `lastSyncAt` is null, Cases 3 and 4 are impossible. All Firestore-only keys → Case 1. All SQLite-only keys → Case 2. Keys on both sides → Case 5, 6, or 7 depending on which `UpdateTime` is more recent (use `Firestore.UpdateTime` vs `SQLite.LastModified` directly, treating `lastSyncAt = DateTime.MinValue`).

**Step 4: Update SyncState**
- Set `SyncState.LastSyncAt = UtcNow`.
- Store `LastRunSummary`.

**Step 5: Rebuild Firestore index documents** (only if Matches or GameEvents were synced):
- `matches/recent`: Write a Firestore document containing the N most recent Match `DateKey` values (sorted descending) with their status. N = `AppSettings.RecentMatchesToStore`.
- `games/_list`: Write a Firestore document containing all active (`!Inactive`) GameEvent names.

### 8.4 Firestore Data Mapping

#### Players (Firestore `ratings/current` and `ratings/archive`)

The legacy app stores all active players as a **single Firestore document** at `ratings/current`, as a map keyed by player ID. The sync service must handle the fan-out: a single Firestore document maps to multiple SQLite `Player` rows.

For change detection on this document type, use the single document's `UpdateTime` as the proxy for all players within it. When the document changes, the sync service diffs individual player entries by comparing their field values to SQLite records.

```
Firestore: ratings/current → { "42": { name, rating, ... }, "43": { ... }, ... }
SQLite:    Players rows with Id=42, Id=43, ...
```

#### Draft (Firestore `drafts/next`)

Single Firestore document → singleton `Draft` row + `DraftPlayers` rows.

#### Matches (Firestore `matches/{dateKey}`)

Each match is a separate Firestore document. Players are stored in `team1` and `team2` arrays within the document.

```
Firestore: matches/2026-04-17 → { team1: [...], team2: [...], scoreTeam1, scoreTeam2, postResults: [...], ... }
SQLite:    Matches row (DateKey=2026-04-17) + MatchPlayers rows
```

#### Game Events (Firestore `games/{name}`)

Each event is a separate Firestore document. Players are stored in `registeredPlayerIds` with parallel `playerReserveStatus` and stars arrays.

### 8.5 Conflict Resolution Flow

1. Admin calls `GET /api/sync/conflicts` → receives list of `SyncConflictDto` with both snapshots.
2. Admin reviews both versions and calls `PUT /api/sync/conflicts/{id}/resolve` with body `{ "winner": "sqlite" | "firestore" }`.
3. Service:
   - If `winner = "sqlite"`: write the `sqliteSnapshot` to Firestore.
   - If `winner = "firestore"`: write the `firestoreSnapshot` to SQLite, updating `LastModified = UtcNow`.
   - Delete the `SyncConflict` row.
4. After resolution the record is no longer skipped on the next sync (both sides now match).

### 8.6 IFirestoreClient Interface

```csharp
public interface IFirestoreClient
{
    Task<IReadOnlyList<FirestoreDocumentSnapshot>> GetCollectionAsync(string collectionPath);
    Task<FirestoreDocumentSnapshot?> GetDocumentAsync(string documentPath);
    Task SetDocumentAsync(string documentPath, object data);
    Task<bool> DocumentExistsAsync(string documentPath);
}

public record FirestoreDocumentSnapshot(
    string DocumentPath,
    IReadOnlyDictionary<string, object?> Fields,
    DateTimeOffset UpdateTime);
```

---

## 9. API Endpoint Reference

All endpoints return `application/json`. Error responses use `application/problem+json` (RFC 7807). Authenticated endpoints require `Authorization: Bearer <jwt>`. Roles are cumulative: Admin can call Organizer and Standard endpoints.

### 9.1 Players

#### `GET /api/players`
**Role:** Standard  
**Response 200:**
```json
[{
  "id": 42,
  "name": "Alice Smith",
  "displayName": "Ali",
  "rating": 7.5,
  "keywords": "alice smith ali",
  "affinity": 0,
  "stars": 2,
  "reserve": false,
  "isArchived": false,
  "mostRecentMatches": [
    { "date": "2026-04-17", "diff": 0.061, "type": null }
  ],
  "lastModified": "2026-04-17T20:30:00Z"
}]
```

#### `GET /api/players/archived`
**Role:** Standard  
**Response 200:** Same shape as above, `isArchived: true` for all items.

#### `POST /api/players`
**Role:** Organizer  
**Request body:**
```json
{
  "name": "Alice Smith",
  "rating": 7.5,
  "displayName": "Ali",
  "keywords": "alice smith ali",
  "affinity": 0,
  "stars": 0,
  "reserve": false
}
```
**Response 201:** Full `PlayerDto`.  
**Errors:** `400` (validation), `422` (business rule violation).

#### `PUT /api/players/{id}`
**Role:** Organizer  
**Request body:** Same shape as POST (all fields, no `id`).  
**Response 200:** Updated `PlayerDto`.  
**Errors:** `400`, `404`.

#### `PATCH /api/players/{id}/archive`
**Role:** Organizer  
**Request body:**
```json
{ "archived": true }
```
**Response 200:** Updated `PlayerDto`.  
**Errors:** `404`.

#### `PATCH /api/players/{id}/rating`
**Role:** Organizer  
**Request body:**
```json
{ "adjustment": -0.5, "note": "Performance review" }
```
`adjustment` is a signed delta applied to the current rating. A `PlayerRecentEntry` with `EntryType = ManualEdit` is appended.  
**Response 200:** Updated `PlayerDto`.  
**Errors:** `404`, `400`.

### 9.2 Draft

#### `GET /api/draft`
**Role:** Standard  
**Response 200:**
```json
{
  "playerIds": [1, 5, 7, 12],
  "lastModified": "2026-04-17T19:00:00Z"
}
```

#### `PUT /api/draft`
**Role:** Organizer  
**Request body:**
```json
{ "playerIds": [1, 5, 7, 12] }
```
Replaces the entire draft. Order is preserved.  
**Response 200:** Updated `DraftDto`.  
**Errors:** `400` (unknown player IDs).

#### `POST /api/draft/generate-teams`
**Role:** Standard  
**Request body:**
```json
{
  "playerIds": [1, 5, 7, 12, 15, 18],
  "affinityOverrides": { "1": 1, "5": 2 }
}
```
`affinityOverrides` is optional and overrides each player's stored affinity for this call only.  
**Response 200:**
```json
[{
  "rank": 1,
  "team1": [{ "id": 1, "name": "Alice", "displayName": "Ali", "rating": 7.5 }],
  "team2": [{ "id": 5, "name": "Bob", "displayName": null, "rating": 7.4 }],
  "team1TotalRating": 22.5,
  "team2TotalRating": 22.4,
  "ratingDiffAbs": 0.1
}]
```
**Errors:** `400` (fewer than 2 players, unknown IDs).

### 9.3 Game Events

#### `GET /api/game-events`
**Role:** Standard  
**Response 200:**
```json
[{
  "name": "2026-04-24_20:00",
  "matchDate": "2026-04-24",
  "playerCount": 12,
  "inactive": false,
  "matchStatus": "unknown"
}]
```
Returns only active (`inactive = false`) events. Ordered by `matchDate` descending.

#### `POST /api/game-events`
**Role:** Organizer  
**Request body:**
```json
{ "matchDate": "2026-04-24", "timeSuffix": "20:00" }
```
`timeSuffix` is optional. The `name` is derived as `{matchDate}_{timeSuffix}` or `{matchDate}` if no suffix. A second event on the same day appends `_2`, `_3`, etc.  
**Response 201:** Full `GameEventDto`.  
**Errors:** `400`, `409` (name conflict).

#### `GET /api/game-events/{name}`
**Role:** Standard  
**Response 200:**
```json
{
  "name": "2026-04-24_20:00",
  "matchDate": "2026-04-24",
  "registrations": [
    { "playerId": 1, "isReserve": false, "stars": 2, "sortOrder": 0 }
  ],
  "inactive": false,
  "matchStatus": "unknown",
  "lastModified": "2026-04-20T10:00:00Z"
}
```
**Errors:** `404`.

#### `PUT /api/game-events/{name}`
**Role:** Organizer  
**Request body:**
```json
{
  "registrations": [
    { "playerId": 1, "isReserve": false, "stars": 2, "sortOrder": 0 }
  ],
  "inactive": false,
  "matchStatus": "unknown"
}
```
Full replacement of the event's mutable fields.  
**Response 200:** Updated `GameEventDto`.  
**Errors:** `404`, `400`.

#### `POST /api/game-events/{name}/join`
**Role:** Standard (linked player required)  
Adds the calling user's linked player to the event.  
**Response 204:** No body.  
**Errors:** `404` (event not found), `409` (already registered), `422` (user not linked to a player, or event is inactive).

#### `DELETE /api/game-events/{name}/join`
**Role:** Standard (linked player required)  
Removes the calling user's linked player from the event.  
**Response 204:** No body.  
**Errors:** `404`, `422` (user not linked, or not registered).

#### `POST /api/game-events/{name}/transfer-to-draft`
**Role:** Organizer  
Replaces the draft's player list with the event's registered players (preserving their sort order).  
**Response 200:** Updated `DraftDto`.  
**Errors:** `404`.

#### `GET /api/game-events/summary`
**Role:** Standard  
**Response 200:**
```json
{
  "events": ["2026-04-24_20:00", "2026-05-01_20:00"],
  "rows": [{
    "playerId": 1,
    "playerName": "Alice Smith",
    "displayName": "Ali",
    "registrations": {
      "2026-04-24_20:00": { "registered": true, "isReserve": false, "stars": 2 }
    }
  }]
}
```
Only active events are included. Rows are sorted by total registration count descending.

### 9.4 Matches

#### `GET /api/matches/recent`
**Role:** Standard  
**Response 200:**
```json
[{ "dateKey": "2026-04-17", "status": "valid" }]
```
Returns the most recent N matches ordered by `dateKey` descending. N = `AppSettings.RecentMatchesToStore`.

#### `GET /api/matches/{dateKey}`
**Role:** Standard  
**Response 200:**
```json
{
  "dateKey": "2026-04-17",
  "team1": [{ "id": 1, "name": "Alice", "rating": 7.5 }],
  "team2": [{ "id": 2, "name": "Bob", "rating": 7.4 }],
  "scoreTeam1": 5,
  "scoreTeam2": 3,
  "savedResult": true,
  "appliedResults": true,
  "postResults": [{ "playerId": 1, "diff": 0.061 }],
  "status": "valid",
  "lastModified": "2026-04-17T22:00:00Z"
}
```
**Errors:** `404`.

#### `POST /api/matches`
**Role:** Organizer  
**Request body:**
```json
{
  "dateKey": "2026-04-17",
  "team1PlayerIds": [1, 5, 7],
  "team2PlayerIds": [2, 6, 8],
  "scoreTeam1": 5,
  "scoreTeam2": 3,
  "status": "valid"
}
```
If `status = "valid"`, rating changes are applied immediately (§7).  
**Response 201:** Full `MatchDto`.  
**Errors:** `400`, `409` (dateKey already exists).

#### `PUT /api/matches/{dateKey}`
**Role:** Organizer  
**Request body:**
```json
{
  "scoreTeam1": 5,
  "scoreTeam2": 3,
  "status": "not_played"
}
```
If status changes from `valid` to `not_played`, rating changes are reversed. If status changes from `not_played` to `valid`, rating changes are applied.  
**Response 200:** Updated `MatchDto`.  
**Errors:** `404`, `400`.

### 9.5 Settings

#### `GET /api/settings`
**Role:** Admin  
**Response 200:**
```json
{
  "autoSave": true,
  "defaultMatchSchedule": [
    { "dayOfWeek": 2, "time": "20:00" },
    { "dayOfWeek": 4, "time": "20:00" }
  ],
  "showPlayerStatusIcons": true,
  "autoNavigateToTransferredDraft": true,
  "randomizePlayerOrder": false,
  "recentMatchesToStore": 8
}
```

#### `PUT /api/settings`
**Role:** Admin  
**Request body:** Same shape as response.  
`recentMatchesToStore` is clamped to [4, 12] server-side.  
**Response 200:** Updated settings.

### 9.6 Users

#### `GET /api/users`
**Role:** Admin  
**Response 200:**
```json
[{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "photoUrl": "https://...",
  "roles": ["standard"],
  "approved": false,
  "isActive": true,
  "linkedPlayerId": null
}]
```

#### `PUT /api/users/{id}/approve`
**Role:** Admin  
**Request body:**
```json
{ "approved": true }
```
**Response 200:** Updated `AppUserDto`.  
**Errors:** `404`.

#### `PUT /api/users/{id}/roles`
**Role:** Admin  
**Request body:**
```json
{ "roles": ["standard", "organizer"] }
```
Valid role strings: `"standard"`, `"organizer"`, `"admin"`. Roles are cumulative (providing `"organizer"` without `"standard"` is an error).  
**Response 200:** Updated `AppUserDto`.  
**Errors:** `404`, `400`.

#### `PUT /api/users/{id}/deactivate`
**Role:** Admin  
**Request body:** None.  
Sets `IsActive = false`, revoking all access.  
**Response 200:** Updated `AppUserDto`.  
**Errors:** `404`.

#### `PUT /api/users/{id}/link-player`
**Role:** Admin  
**Request body:**
```json
{ "playerId": 42 }
```
Links an AppUser to a Player. Used for PSR-1.  
**Response 200:** Updated `AppUserDto`.  
**Errors:** `404`, `409` (player already linked to another user).

### 9.7 Authentication

#### `GET /api/auth/google`
**Role:** Public  
Redirects (`302`) to Google's OAuth authorization endpoint. Sets `tfl_oauth_state` cookie.

#### `GET /api/auth/callback`
**Role:** Public  
Handles the OAuth callback. Validates state, exchanges code, upserts user, issues JWT.  
**On success:** `302` redirect to `/?token=<jwt>`.  
**On failure:** `302` redirect to `/signin?error=<reason>`.

### 9.8 Notifications

#### `POST /api/notifications/subscribe`
**Role:** Standard  
**Request body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": { "p256dh": "...", "auth": "..." }
}
```
**Response 204:** No body.

#### `DELETE /api/notifications/subscribe`
**Role:** Standard  
**Request body:**
```json
{ "endpoint": "https://fcm.googleapis.com/fcm/send/..." }
```
**Response 204:** No body.

### 9.9 Firebase Sync

#### `GET /api/sync/status`
**Role:** Admin  
**Response 200:**
```json
{
  "lastSyncAt": {
    "Players":    "2026-04-17T12:00:00Z",
    "Matches":    "2026-04-17T12:00:00Z",
    "GameEvents": null,
    "Draft":      "2026-04-17T12:00:00Z"
  },
  "unresolvedConflicts": 2,
  "lastRunSummaries": {
    "Players":    { "created": 2, "updated": 1, "skipped": 10, "conflicts": 1, "softDeleted": 0, "durationMs": 800 },
    "Matches":    { "created": 0, "updated": 0, "skipped": 24, "conflicts": 0, "softDeleted": 0, "durationMs": 200 },
    "GameEvents": null,
    "Draft":      { "created": 0, "updated": 1, "skipped": 0, "conflicts": 0, "softDeleted": 0, "durationMs": 100 }
  }
}
```

#### `POST /api/sync`
**Role:** Admin  
Triggers a full sync across all four entity types sequentially.  
**Response 200:**
```json
{
  "Players":    { "created": 0, "updated": 0, "skipped": 15, "conflicts": 0, "softDeleted": 0, "durationMs": 500 },
  "Matches":    { ... },
  "GameEvents": { ... },
  "Draft":      { ... }
}
```

#### `POST /api/sync/{entityType}`
**Role:** Admin  
`{entityType}` is one of: `players`, `matches`, `game-events`, `draft`.  
**Response 200:** Single `SyncRunSummaryDto`.  
**Errors:** `400` (unknown entity type).

#### `GET /api/sync/conflicts`
**Role:** Admin  
**Response 200:**
```json
[{
  "id": 1,
  "entityType": "Player",
  "entityKey": "42",
  "sqliteSnapshot": { "id": 42, "name": "Alice", "rating": 7.5, "..." },
  "firestoreSnapshot": { "id": 42, "name": "Alice", "rating": 7.8, "..." },
  "detectedAt": "2026-04-17T12:05:00Z"
}]
```

#### `PUT /api/sync/conflicts/{id}/resolve`
**Role:** Admin  
**Request body:**
```json
{ "winner": "sqlite" }
```
`winner` is `"sqlite"` or `"firestore"`.  
**Response 200:** No body (conflict deleted).  
**Errors:** `404`, `400`.

---

## 10. Frontend Architecture

### 10.1 Technology Stack

| Concern | Choice |
|---------|--------|
| Framework | Angular (latest stable) |
| Component style | Standalone components (no NgModules) |
| State | Angular Signals |
| HTTP | `HttpClient` with functional interceptors |
| Routing | `provideRouter` with lazy-loaded feature routes |
| Styling | Component-scoped CSS + global `styles.css` |
| Build | Angular CLI (`ng build`) |

### 10.2 Folder Structure

```
tfl-frontend/src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts          # Signals: currentUser, isAuthenticated, userRoles
│   │   ├── auth.guard.ts            # Functional guard: requiresStandard
│   │   ├── organizer.guard.ts       # Functional guard: requiresOrganizer
│   │   ├── admin.guard.ts           # Functional guard: requiresAdmin
│   │   └── auth.interceptor.ts      # Attaches JWT to all outgoing requests
│   ├── api/
│   │   ├── players-api.service.ts
│   │   ├── matches-api.service.ts
│   │   ├── game-events-api.service.ts
│   │   ├── draft-api.service.ts
│   │   ├── settings-api.service.ts
│   │   ├── users-api.service.ts
│   │   ├── sync-api.service.ts
│   │   └── notifications-api.service.ts
│   └── models/
│       ├── player.model.ts
│       ├── match.model.ts
│       ├── game-event.model.ts
│       ├── draft.model.ts
│       ├── app-settings.model.ts
│       ├── app-user.model.ts
│       └── sync.model.ts
├── features/
│   ├── about/
│   │   └── about.component.ts
│   ├── signin/
│   │   └── signin.component.ts
│   ├── privacy/
│   │   └── privacy.component.ts
│   ├── players/
│   │   ├── players.routes.ts
│   │   ├── player-list/
│   │   │   └── player-list.component.ts
│   │   ├── player-detail/
│   │   │   └── player-detail.component.ts
│   │   └── player-edit/
│   │       └── player-edit.component.ts
│   ├── draft/
│   │   ├── draft.routes.ts
│   │   ├── draft-page/
│   │   │   └── draft-page.component.ts
│   │   └── team-results/
│   │       └── team-results.component.ts
│   ├── game-events/
│   │   ├── game-events.routes.ts
│   │   ├── game-events-list/
│   │   ├── game-event-detail/
│   │   └── game-events-summary/
│   ├── matches/
│   │   ├── matches.routes.ts
│   │   ├── match-history/
│   │   └── match-detail/
│   └── admin/
│       ├── admin.routes.ts
│       ├── admin-settings/
│       ├── user-management/
│       └── sync/
│           └── sync-page.component.ts
├── shared/
│   ├── components/
│   │   ├── player-card/
│   │   └── rating-badge/
│   ├── pipes/
│   │   └── player-filter.pipe.ts
│   └── directives/
│       └── copy-clipboard.directive.ts
├── app.routes.ts
└── app.config.ts
```

### 10.3 Routing

`app.routes.ts` — all feature routes use `loadComponent` for lazy loading:

```typescript
export const routes: Routes = [
  { path: '',          redirectTo: 'about', pathMatch: 'full' },
  { path: 'about',     loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'signin',    loadComponent: () => import('./features/signin/signin.component').then(m => m.SigninComponent) },
  { path: 'privacy',   loadComponent: () => import('./features/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'players',   canActivate: [authGuard], loadChildren: () => import('./features/players/players.routes').then(m => m.PLAYER_ROUTES) },
  { path: 'nextdraft', canActivate: [authGuard], loadChildren: () => import('./features/draft/draft.routes').then(m => m.DRAFT_ROUTES) },
  { path: 'games',     canActivate: [authGuard], loadChildren: () => import('./features/game-events/game-events.routes').then(m => m.GAME_EVENT_ROUTES) },
  { path: 'recent',    canActivate: [authGuard], loadChildren: () => import('./features/matches/matches.routes').then(m => m.MATCH_ROUTES) },
  { path: 'admin',     canActivate: [adminGuard], loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
];
```

### 10.4 Signal-Based Service Pattern

API services expose signals for component consumption. HTTP calls update the signals. This isolates the transport layer from components (NFR-M2).

```typescript
// core/api/players-api.service.ts
@Injectable({ providedIn: 'root' })
export class PlayersApiService {
  private http = inject(HttpClient);

  // Writable signals (private)
  private _players = signal<Player[]>([]);
  private _loading = signal(false);

  // Read-only signals exposed to components
  readonly players = this._players.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadPlayers(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get<Player[]>('/api/players'));
      this._players.set(result);
    } finally {
      this._loading.set(false);
    }
  }

  async createPlayer(request: CreatePlayerRequest): Promise<Player> {
    const player = await firstValueFrom(this.http.post<Player>('/api/players', request));
    this._players.update(list => [...list, player]);
    return player;
  }
}
```

Components inject the service and use the read-only signals directly in templates:
```typescript
@Component({
  template: `
    @for (player of playersApi.players(); track player.id) {
      <app-player-card [player]="player" />
    }
  `
})
export class PlayerListComponent {
  playersApi = inject(PlayersApiService);

  ngOnInit() { this.playersApi.loadPlayers(); }
}
```

### 10.5 Authentication Service

```typescript
// core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<AppUser | null>(null);

  readonly currentUser  = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isOrganizer     = computed(() => this._currentUser()?.roles.includes('organizer') ?? false);
  readonly isAdmin         = computed(() => this._currentUser()?.roles.includes('admin') ?? false);

  initialize(): void {
    const token = localStorage.getItem('tfl_token');
    if (token && !this.isTokenExpired(token)) {
      this._currentUser.set(this.parseToken(token));
    }
  }

  storeToken(token: string): void {
    localStorage.setItem('tfl_token', token);
    this._currentUser.set(this.parseToken(token));
  }

  signOut(): void {
    localStorage.removeItem('tfl_token');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('tfl_token');
  }
}
```

On app startup (`APP_INITIALIZER`), `AuthService.initialize()` is called to restore session from `localStorage`.

### 10.6 Functional Guards

```typescript
// core/auth/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/signin');
};

// core/auth/admin.guard.ts
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.parseUrl('/about');
};
```

### 10.7 HTTP Interceptor

```typescript
// core/auth/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

Registered in `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => auth.initialize(),
      deps: [AuthService],
      multi: true
    }
  ]
};
```

### 10.8 Token Callback Handling

The `SigninComponent` (at `/signin`) checks the URL for a `?token=` query parameter on load:
```typescript
ngOnInit(): void {
  const token = this.route.snapshot.queryParamMap.get('token');
  if (token) {
    this.authService.storeToken(token);
    this.router.navigate(['/players']);
  }
}
```

### 10.9 Sync Page (`/admin/sync`)

`SyncPageComponent` provides:
- **Status panel:** last sync timestamp per entity type, count of unresolved conflicts.
- **Trigger controls:** "Sync All" button + per-entity-type trigger buttons. Show a spinner during sync.
- **Conflict list:** expandable table showing both snapshots side-by-side with "Use SQLite" / "Use Firebase" resolution buttons per conflict.

---

## 11. Deployment Architecture

### 11.1 File System Layout (Production)

```
/opt/tfl/
├── TFL.API                    ← self-contained .NET 10 binary (dotnet publish -r linux-x64 --self-contained)
├── wwwroot/                   ← Angular build output (ng build --output-path=../tfl-backend/wwwroot)
├── appsettings.Production.json
└── appsettings.json

/var/tfl/
├── data/
│   └── tfl.db                 ← SQLite database
├── logs/
│   └── tfl-YYYY-MM-DD.log     ← Serilog rolling files
└── secrets/
    └── firestore-key.json     ← Google Cloud service account key (chmod 600, owned by tfl user)
```

### 11.2 systemd Unit

`/etc/systemd/system/tfl.service`:

```ini
[Unit]
Description=TFL Web Application
After=network.target

[Service]
WorkingDirectory=/opt/tfl
ExecStart=/opt/tfl/TFL.API
Restart=always
RestartSec=5
User=tfl
Group=tfl
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
```

### 11.3 Nginx Configuration

```nginx
server {
    listen 80;
    server_name tfl.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name tfl.example.com;

    ssl_certificate     /etc/letsencrypt/live/tfl.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tfl.example.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

### 11.4 Build & Deploy Steps

1. **Frontend:** `cd tfl-frontend && ng build --configuration production` — output goes to `tfl-backend/src/TFL.API/wwwroot/`.
2. **Backend:** `cd tfl-backend && dotnet publish src/TFL.API -c Release -r linux-x64 --self-contained -o /opt/tfl`.
3. **Reload:** `systemctl restart tfl`.
4. Migrations run automatically on startup.

### 11.5 Backup Strategy (operational, outside this spec)

The SQLite database at `/var/tfl/data/tfl.db` must be included in a periodic backup job (e.g. daily `cp` to a remote location). EF Core WAL mode should be enabled for safe hot-copy: `PRAGMA journal_mode=WAL` — set in `TflDbContext.OnConfiguring`.

---

## 12. Testing Strategy

### 12.1 Structure

```
tfl-backend/tests/TFL.Tests.Unit/
├── TFL.Tests.Unit.csproj       ← references TFL.Application + TFL.Domain; xUnit + Moq
├── Services/
│   ├── RatingServiceTests.cs
│   ├── TeamBalancingServiceTests.cs
│   └── SyncServiceTests.cs
```

Dependencies: **xUnit**, **Moq** (for mocking repository interfaces).

### 12.2 RatingServiceTests

| Test | Description |
|------|-------------|
| `Apply_ValidMatch_WinnersGainRating` | Winners' rating increases by `adjustment`. |
| `Apply_ValidMatch_LosersLoseRating` | Losers' rating decreases by `adjustment`. |
| `Apply_Formula_ZeroGoalDiff` | `adjustment = 0.05 + 0 × 0.011 = 0.05`. |
| `Apply_Formula_FiveGoalDiff` | `adjustment = 0.05 + 5 × 0.011 = 0.105`. |
| `Apply_AppendsRecentEntry` | A `PlayerRecentEntry` with the correct `Diff` is appended for each player. |
| `Apply_RollingWindow_TruncatesOldestEntry` | When `recentMatchesToStore = 4` and player has 4 entries, applying a new match removes the entry with the lowest `SortOrder`. |
| `Apply_NotPlayedStatus_NoRatingChanges` | No player ratings or recent entries are modified for a `NotPlayed` match. |
| `Apply_Transaction_AllOrNothing` | If one player update fails mid-transaction, no players are updated (verified via mock throwing on the second call). |
| `Reverse_RemovesAppliedChanges` | Calling reverse restores each player's rating to pre-match value and removes the recent entry. |

### 12.3 TeamBalancingServiceTests

| Test | Description |
|------|-------------|
| `Generate_TwoPlayers_ReturnsOneCombination` | C(2,1) = 1. |
| `Generate_SixPlayers_Returns15Combinations` | C(6,3) = 20, all returned (≤ 20). |
| `Generate_TwentyPlayers_Returns20Combinations` | C(20,10) = 184,756; only top 20 returned. |
| `Generate_SortedByDiffAscending` | First combination has the smallest `ratingDiffAbs`. |
| `Generate_Affinity1_PlayerAlwaysOnTeam1` | Player with `affinity = 1` appears in `team1` for every combination. |
| `Generate_Affinity2_PlayerAlwaysOnTeam2` | Player with `affinity = 2` appears in `team2` for every combination. |
| `Generate_UnsatisfiableAffinity_ReturnsEmpty` | If locked players make equal splits impossible, returns empty list. |
| `Generate_OddPlayerCount_Teams differ by one` | 7 players → team1 has 3, team2 has 4 (or vice versa). |
| `Generate_EmptyList_ReturnsEmpty` | Zero players → empty result. |

### 12.4 SyncServiceTests

Each test provides mock implementations of `IFirestoreClient`, repository interfaces, and `ISyncStateRepository`.

| Test | Description |
|------|-------------|
| `Sync_FirestoreOnly_CreatesInSQLite` | Firestore doc with no SQLite match → new SQLite record created. |
| `Sync_SQLiteOnly_NoPriorSync_PushesToFirestore` | SQLite record, no Firestore doc, `lastSyncAt = null` → Firestore document created. |
| `Sync_FirestoreDeleted_AfterPriorSync_SoftDeletesInSQLite` | SQLite record (unmodified since last sync), no Firestore doc → `IsArchived = true`. |
| `Sync_Unchanged_Skipped` | Both sides unchanged since last sync → no writes, increment `skipped`. |
| `Sync_FirestoreNewer_UpdatesSQLite` | Firestore `UpdateTime > lastSyncAt`, SQLite `LastModified <= lastSyncAt` → SQLite updated. |
| `Sync_SQLiteNewer_UpdatesFirestore` | SQLite `LastModified > lastSyncAt`, Firestore `UpdateTime <= lastSyncAt` → Firestore updated. |
| `Sync_BothChanged_CreatesConflict` | Both sides changed since last sync → `SyncConflict` record created, record skipped. |
| `Sync_Idempotent_NoChanges` | Running sync twice with no intervening changes → second run: all skipped, no writes. |
| `Resolve_SQLiteWins_WritesToFirestore` | `resolve(id, "sqlite")` → Firestore updated with SQLite snapshot, conflict deleted. |
| `Resolve_FirestoreWins_WritesToSQLite` | `resolve(id, "firestore")` → SQLite updated with Firestore snapshot, conflict deleted. |
| `Sync_PostSync_RebuildsFirestoreIndexDocs` | After match sync, `IFirestoreClient.SetDocumentAsync` is called for `matches/recent` and `games/_list`. |
| `Sync_Bootstrap_EmptySQLite_ImportsAll` | All Firestore docs → all created in SQLite. `SyncState.LastSyncAt` updated. |

---

## Appendix A: Requirement Coverage

| Requirement Area | Architecture Section |
|-----------------|---------------------|
| AUTH-1 – AUTH-5 | §5 (Authentication Flow) |
| REG-1 – REG-4 | §5.1, §9.6 |
| PLR-1 – PLR-10 | §3.3 (PlayerService), §9.1 |
| DRF-1 – DRF-12 | §6 (Balancing), §3.3 (DraftService), §9.2 |
| GEV-1 – GEV-12 | §3.3 (GameEventService), §9.3 |
| MAT-1 – MAT-9 | §7 (Rating Formula), §3.3 (MatchService), §9.4 |
| SET-1 – SET-3 | §3.3 (SettingsService), §9.5 |
| USR-1 – USR-4 | §9.6 |
| PSR-1 – PSR-3 | §9.3 (join/leave), §9.6 (link-player) |
| EML-1 – EML-5 | §3.3 (NotificationService), §3.2 (IEmailService) |
| PSH-1 – PSH-5 | §3.2 (IPushService), §3.4 (VapidPushService), §9.8 |
| SYN-1 – SYN-15 | §8 (Firebase Sync Architecture), §9.9 |
| NFR-P1 – NFR-P2 | §6.2 (complexity note) |
| NFR-S1 – NFR-S6 | §3.5 (Program.cs), §5 |
| NFR-R1 – NFR-R2 | §7.2 (transaction), §11.5 (backup) |
| NFR-D1 – NFR-D4 | §11 (Deployment) |
| NFR-M1 – NFR-M2 | §3.1 (Clean Architecture), §10.4 (service layer) |

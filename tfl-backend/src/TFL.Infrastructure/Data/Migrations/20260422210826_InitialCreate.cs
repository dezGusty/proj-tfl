using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TFL.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AutoSave = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShowPlayerStatusIcons = table.Column<bool>(type: "INTEGER", nullable: false),
                    AutoNavigateToTransferredDraft = table.Column<bool>(type: "INTEGER", nullable: false),
                    RandomizePlayerOrder = table.Column<bool>(type: "INTEGER", nullable: false),
                    RecentMatchesToStore = table.Column<int>(type: "INTEGER", nullable: false),
                    DefaultMatchSchedule = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Drafts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LastModified = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drafts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExternalMailList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalMailList", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameEvents",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    MatchDate = table.Column<string>(type: "TEXT", nullable: false),
                    Inactive = table.Column<bool>(type: "INTEGER", nullable: false),
                    MatchStatus = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModified = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameEvents", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    DateKey = table.Column<string>(type: "TEXT", nullable: false),
                    ScoreTeam1 = table.Column<int>(type: "INTEGER", nullable: false),
                    ScoreTeam2 = table.Column<int>(type: "INTEGER", nullable: false),
                    SavedResult = table.Column<bool>(type: "INTEGER", nullable: false),
                    AppliedResults = table.Column<bool>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModified = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.DateKey);
                });

            migrationBuilder.CreateTable(
                name: "RatingSnapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    Version = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayersJson = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RatingSnapshots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SyncConflicts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EntityType = table.Column<string>(type: "TEXT", nullable: false),
                    EntityKey = table.Column<string>(type: "TEXT", nullable: false),
                    SqliteSnapshot = table.Column<string>(type: "TEXT", nullable: false),
                    FirestoreSnapshot = table.Column<string>(type: "TEXT", nullable: false),
                    DetectedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncConflicts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SyncStates",
                columns: table => new
                {
                    EntityType = table.Column<string>(type: "TEXT", nullable: false),
                    LastSyncAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastRunSummary = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncStates", x => x.EntityType);
                });

            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PhotoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Roles = table.Column<int>(type: "INTEGER", nullable: false),
                    Approved = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    LinkedPlayerId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    Rating = table.Column<double>(type: "REAL", nullable: false),
                    Keywords = table.Column<string>(type: "TEXT", nullable: true),
                    Affinity = table.Column<int>(type: "INTEGER", nullable: false),
                    Stars = table.Column<int>(type: "INTEGER", nullable: false),
                    Reserve = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsArchived = table.Column<bool>(type: "INTEGER", nullable: false),
                    LastModified = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LinkedUserId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Players_AppUsers_LinkedUserId",
                        column: x => x.LinkedUserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PushSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Endpoint = table.Column<string>(type: "TEXT", nullable: false),
                    P256dh = table.Column<string>(type: "TEXT", nullable: false),
                    Auth = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PushSubscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PushSubscriptions_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DraftPlayers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DraftId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DraftPlayers_Drafts_DraftId",
                        column: x => x.DraftId,
                        principalTable: "Drafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DraftPlayers_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameEventRegistrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GameEventName = table.Column<string>(type: "TEXT", nullable: false),
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsReserve = table.Column<bool>(type: "INTEGER", nullable: false),
                    Stars = table.Column<int>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameEventRegistrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameEventRegistrations_GameEvents_GameEventName",
                        column: x => x.GameEventName,
                        principalTable: "GameEvents",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameEventRegistrations_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchPlayers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MatchDateKey = table.Column<string>(type: "TEXT", nullable: false),
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false),
                    Team = table.Column<int>(type: "INTEGER", nullable: false),
                    RatingDiff = table.Column<double>(type: "REAL", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchPlayers_Matches_MatchDateKey",
                        column: x => x.MatchDateKey,
                        principalTable: "Matches",
                        principalColumn: "DateKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchPlayers_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayerRecentEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false),
                    MatchDate = table.Column<string>(type: "TEXT", nullable: false),
                    Diff = table.Column<double>(type: "REAL", nullable: false),
                    EntryType = table.Column<int>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerRecentEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerRecentEntries_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AppSettings",
                columns: new[] { "Id", "AutoNavigateToTransferredDraft", "AutoSave", "DefaultMatchSchedule", "RandomizePlayerOrder", "RecentMatchesToStore", "ShowPlayerStatusIcons" },
                values: new object[] { 1, true, true, "[{\"dayOfWeek\":2,\"time\":\"20:00\"},{\"dayOfWeek\":4,\"time\":\"20:00\"}]", false, 8, true });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Email",
                table: "AppUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_LinkedPlayerId",
                table: "AppUsers",
                column: "LinkedPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftPlayers_PlayerId",
                table: "DraftPlayers",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "UX_DraftPlayers_DraftId_PlayerId",
                table: "DraftPlayers",
                columns: new[] { "DraftId", "PlayerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExternalMailList_Email",
                table: "ExternalMailList",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameEventRegistrations_PlayerId",
                table: "GameEventRegistrations",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "UX_GameEventRegistrations_EventName_PlayerId",
                table: "GameEventRegistrations",
                columns: new[] { "GameEventName", "PlayerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameEvents_Inactive",
                table: "GameEvents",
                column: "Inactive");

            migrationBuilder.CreateIndex(
                name: "IX_GameEvents_MatchDate",
                table: "GameEvents",
                column: "MatchDate");

            migrationBuilder.CreateIndex(
                name: "IX_MatchPlayers_PlayerId",
                table: "MatchPlayers",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "UX_MatchPlayers_MatchDateKey_PlayerId",
                table: "MatchPlayers",
                columns: new[] { "MatchDateKey", "PlayerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LastModified",
                table: "Matches",
                column: "LastModified");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Status",
                table: "Matches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRecentEntries_PlayerId",
                table: "PlayerRecentEntries",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IsArchived",
                table: "Players",
                column: "IsArchived");

            migrationBuilder.CreateIndex(
                name: "IX_Players_LastModified",
                table: "Players",
                column: "LastModified");

            migrationBuilder.CreateIndex(
                name: "IX_Players_LinkedUserId",
                table: "Players",
                column: "LinkedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PushSubscriptions_Endpoint",
                table: "PushSubscriptions",
                column: "Endpoint",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PushSubscriptions_UserId",
                table: "PushSubscriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UX_SyncConflicts_EntityType_EntityKey",
                table: "SyncConflicts",
                columns: new[] { "EntityType", "EntityKey" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_Players_LinkedPlayerId",
                table: "AppUsers",
                column: "LinkedPlayerId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_Players_LinkedPlayerId",
                table: "AppUsers");

            migrationBuilder.DropTable(
                name: "AppSettings");

            migrationBuilder.DropTable(
                name: "DraftPlayers");

            migrationBuilder.DropTable(
                name: "ExternalMailList");

            migrationBuilder.DropTable(
                name: "GameEventRegistrations");

            migrationBuilder.DropTable(
                name: "MatchPlayers");

            migrationBuilder.DropTable(
                name: "PlayerRecentEntries");

            migrationBuilder.DropTable(
                name: "PushSubscriptions");

            migrationBuilder.DropTable(
                name: "RatingSnapshots");

            migrationBuilder.DropTable(
                name: "SyncConflicts");

            migrationBuilder.DropTable(
                name: "SyncStates");

            migrationBuilder.DropTable(
                name: "Drafts");

            migrationBuilder.DropTable(
                name: "GameEvents");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "AppUsers");
        }
    }
}

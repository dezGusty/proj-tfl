using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using TFL.API.Middleware;
using TFL.Application.Interfaces;
using TFL.Application.Interfaces.Repositories;
using TFL.Application.Services;
using TFL.Infrastructure.Data;
using TFL.Infrastructure.Data.Repositories;
using TFL.Infrastructure.Email;
using TFL.Infrastructure.Firebase;
using TFL.Infrastructure.Push;

// 1. Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .AddEnvironmentVariables()
        .Build())
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

var config = builder.Configuration;

// 2. Services
var dbPath = config["Database:Path"] ?? "tfl.db";
builder.Services.AddDbContext<TflDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Repositories
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IGameEventRepository, GameEventRepository>();
builder.Services.AddScoped<IDraftRepository, DraftRepository>();
builder.Services.AddScoped<IAppUserRepository, AppUserRepository>();
builder.Services.AddScoped<IAppSettingsRepository, AppSettingsRepository>();
builder.Services.AddScoped<ISyncConflictRepository, SyncConflictRepository>();
builder.Services.AddScoped<ISyncStateRepository, SyncStateRepository>();
builder.Services.AddScoped<IPushSubscriptionRepository, PushSubscriptionRepository>();
builder.Services.AddScoped<IExternalMailRepository, ExternalMailRepository>();
builder.Services.AddScoped<IRatingSnapshotRepository, RatingSnapshotRepository>();

// Application Services
builder.Services.AddScoped<PlayerService>();
builder.Services.AddScoped<MatchService>();
builder.Services.AddScoped<GameEventService>();
builder.Services.AddScoped<DraftService>();
builder.Services.AddScoped<TeamBalancingService>();
builder.Services.AddScoped<RatingService>();
builder.Services.AddScoped<SettingsService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<SyncService>();

// Infrastructure services
var firestoreProjectId = config["Firestore:ProjectId"];
var firestoreKeyPath = config["Firestore:ServiceAccountKeyPath"];
if (!string.IsNullOrEmpty(firestoreProjectId))
{
    builder.Services.AddSingleton<IFirestoreClient>(_ =>
        new FirestoreClient(firestoreProjectId, firestoreKeyPath));
}
else
{
    // Null implementation for development without Firebase
    builder.Services.AddSingleton<IFirestoreClient, NullFirestoreClient>();
}

var smtpHost = config["Smtp:Host"];
if (!string.IsNullOrEmpty(smtpHost))
{
    builder.Services.AddSingleton<IEmailService>(_ => new SmtpEmailService(
        smtpHost,
        int.Parse(config["Smtp:Port"] ?? "587"),
        config["Smtp:Username"] ?? "",
        config["Smtp:Password"] ?? "",
        config["Smtp:FromAddress"] ?? "tfl@example.com",
        config["Smtp:FromName"] ?? "TFL"));
}
else
{
    builder.Services.AddSingleton<IEmailService, NullEmailService>();
}

var vapidPublicKey = config["Vapid:PublicKey"];
if (!string.IsNullOrEmpty(vapidPublicKey))
{
    builder.Services.AddSingleton<IPushService>(_ => new VapidPushService(
        vapidPublicKey,
        config["Vapid:PrivateKey"]!,
        config["Vapid:Subject"]!));
}
else
{
    builder.Services.AddSingleton<IPushService, NullPushService>();
}

builder.Services.AddHttpClient();

// 3. JWT Bearer Auth
var jwtSecret = config["Jwt:Secret"] ?? "change-this-secret-to-something-32-chars-min!!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"] ?? "tfl-api",
            ValidAudience = config["Jwt:Audience"] ?? "tfl-frontend",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// 4. Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Standard", p => p
        .RequireAuthenticatedUser()
        .RequireClaim("approved", "true")
        .RequireClaim("roles", "standard"));
    options.AddPolicy("Organizer", p => p
        .RequireAuthenticatedUser()
        .RequireClaim("approved", "true")
        .RequireClaim("roles", "organizer"));
    options.AddPolicy("Admin", p => p
        .RequireAuthenticatedUser()
        .RequireClaim("approved", "true")
        .RequireClaim("roles", "admin"));
});

// 5. CORS
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(p =>
    {
        var allowedOrigin = config["Cors:AllowedOrigin"];
        if (!string.IsNullOrEmpty(allowedOrigin))
            p.WithOrigins(allowedOrigin).AllowAnyHeader().AllowAnyMethod();
        else
            p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    }));

// 6. Controllers + ProblemDetails
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddProblemDetails();

var app = builder.Build();

// 7. Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

// 8. Apply pending migrations
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TflDbContext>();
    await db.Database.MigrateAsync();
}

await app.RunAsync();

// Null implementations for optional services
public class NullFirestoreClient : IFirestoreClient
{
    public Task<IReadOnlyList<FirestoreDocumentSnapshot>> GetCollectionAsync(string collectionPath) =>
        Task.FromResult<IReadOnlyList<FirestoreDocumentSnapshot>>([]);
    public Task<FirestoreDocumentSnapshot?> GetDocumentAsync(string documentPath) =>
        Task.FromResult<FirestoreDocumentSnapshot?>(null);
    public Task SetDocumentAsync(string documentPath, object data) => Task.CompletedTask;
    public Task<bool> DocumentExistsAsync(string documentPath) => Task.FromResult(false);
}

public class NullEmailService : IEmailService
{
    public Task SendAsync(IEnumerable<string> recipients, string subject, string htmlBody) => Task.CompletedTask;
}

public class NullPushService : IPushService
{
    public Task SendAsync(string endpoint, string p256dh, string auth, string payload) => Task.CompletedTask;
}

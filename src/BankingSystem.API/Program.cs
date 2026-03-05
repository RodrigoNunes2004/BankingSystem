using BankingSystem.Infrastructure.Data;
using BankingSystem.Infrastructure.Repositories;
using BankingSystem.Domain.Interfaces;
using BankingSystem.application.Services;
using BankingSystem.application.Mappings;
using BankingSystem.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Npgsql 6+ requires UTC for timestamptz; this allows Unspecified (e.g. from JSON dates)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Render and similar hosts set PORT; bind to 0.0.0.0 for container networking
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework - Neon DB (PostgreSQL)
// Prefer DATABASE_URL (Render, Railway, Heroku standard); fallback to ConnectionStrings:DefaultConnection
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BankingDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure()));

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

// Add services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<JwtService>();

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] 
  ?? Environment.GetEnvironmentVariable("Jwt__Key") 
  ?? "dev-key-min-32-chars-for-hs256-change-in-prod!!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "BankingSystem",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "BankingSystem",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Add CORS - must allow Vercel (and other) origins for cross-origin requests
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline - UseCors MUST run before UseAuthentication
app.UseRouting();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Minimal health endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow, db = "Neon PostgreSQL" });

app.MapControllers();

app.Run();

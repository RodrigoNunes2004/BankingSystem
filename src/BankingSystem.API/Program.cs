using BankingSystem.Infrastructure.Data;
using BankingSystem.Infrastructure.Repositories;
using BankingSystem.Domain.Interfaces;
using BankingSystem.application.Services;
using BankingSystem.application.Mappings;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<BankingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), 
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));

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

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "https://banking-system-v3-nte4lnzmx-rodrigos-projects-2e367d33.vercel.app",
                "https://banking-system-v3.vercel.app",
                "http://localhost:3000",
                "http://localhost:3001"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// CORS must be before other middleware
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();

// Add a simple health check endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Add a simple test endpoint that doesn't require database
app.MapGet("/api/test-simple", () => new { message = "API is working", timestamp = DateTime.UtcNow });

// Add a debug endpoint to show connection string
app.MapGet("/api/debug-connection", (IConfiguration config) => new { 
    connectionString = config.GetConnectionString("DefaultConnection"),
    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
    timestamp = DateTime.UtcNow 
});

// Add an endpoint to test database connection
app.MapGet("/api/test-db", async (HttpContext httpContext) => {
    try {
        var context = httpContext.RequestServices.GetRequiredService<BankingDbContext>();
        var canConnect = await context.Database.CanConnectAsync();
        return Results.Ok(new { 
            message = "Database connection test", 
            canConnect = canConnect,
            timestamp = DateTime.UtcNow 
        });
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "Database connection failed", 
            error = ex.Message,
            timestamp = DateTime.UtcNow 
        });
    }
});

// Add an endpoint to initialize the database
app.MapPost("/api/init-db", async (HttpContext httpContext) => {
    try {
        var context = httpContext.RequestServices.GetRequiredService<BankingDbContext>();
        await context.Database.EnsureCreatedAsync();
        return Results.Ok(new { 
            message = "Database initialized successfully", 
            timestamp = DateTime.UtcNow 
        });
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "Database initialization failed", 
            error = ex.Message,
            timestamp = DateTime.UtcNow 
        });
    }
});

app.MapControllers();

app.Run();

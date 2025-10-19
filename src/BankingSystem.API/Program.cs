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

// Add CORS - Updated to fix Vercel frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .SetIsOriginAllowed(origin => true);
    });
    
    // Add a more permissive policy as backup
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// CORS must be before other middleware
app.UseCors("AllowReactApp");
app.UseCors(); // Use default policy as backup

// Add manual CORS handling as final fallback
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }
    
    await next();
});

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

// Add an endpoint to reset/clear all data
app.MapPost("/api/reset-db", async (HttpContext httpContext) => {
    try {
        var context = httpContext.RequestServices.GetRequiredService<BankingDbContext>();
        
        // Clear all data
        context.Transactions.RemoveRange(context.Transactions);
        context.Accounts.RemoveRange(context.Accounts);
        context.Users.RemoveRange(context.Users);
        
        await context.SaveChangesAsync();
        
        return Results.Ok(new { 
            message = "Database reset successfully - all data cleared", 
            timestamp = DateTime.UtcNow 
        });
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "Database reset failed", 
            error = ex.Message,
            timestamp = DateTime.UtcNow 
        });
    }
});

app.MapControllers();

app.Run();

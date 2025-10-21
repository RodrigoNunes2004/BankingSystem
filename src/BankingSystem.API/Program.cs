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

// Add CORS - Simple, clean configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS middleware - simple and clean
app.UseCors();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();

// Add a simple health check endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow, version = "2.0" });

// Add a simple proxy endpoint that bypasses all CORS issues
app.MapPost("/api/proxy/users", async (HttpContext context) => {
    try {
        var contextService = context.RequestServices.GetRequiredService<BankingDbContext>();
        
        // Read the request body
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();
        var userData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(body);
        
        // Create user
        var user = new BankingSystem.Domain.Entities.User
        {
            FirstName = userData.TryGetProperty("firstName", out var firstName) ? firstName.GetString() ?? "" : "",
            LastName = userData.TryGetProperty("lastName", out var lastName) ? lastName.GetString() ?? "" : "",
            Email = userData.TryGetProperty("email", out var email) ? email.GetString() ?? "" : "",
            PhoneNumber = userData.TryGetProperty("phoneNumber", out var phoneNumber) ? phoneNumber.GetString() ?? "" : "",
            DateOfBirth = userData.TryGetProperty("dateOfBirth", out var dateOfBirth) && DateTime.TryParse(dateOfBirth.GetString(), out DateTime parsedDate) ? parsedDate : DateTime.Now,
            Address = userData.TryGetProperty("address", out var address) ? address.GetString() ?? "" : "",
            City = userData.TryGetProperty("city", out var city) ? city.GetString() ?? "" : "",
            PostalCode = userData.TryGetProperty("postalCode", out var postalCode) ? postalCode.GetString() ?? "" : "",
            Country = userData.TryGetProperty("country", out var country) ? country.GetString() ?? "" : "",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        contextService.Users.Add(user);
        await contextService.SaveChangesAsync();

        return Results.Ok(new { 
            message = "User created successfully via proxy", 
            id = user.Id,
            user = user
        });
    } catch (Exception ex) {
        return Results.Ok(new { message = "Proxy user creation failed", error = ex.Message });
    }
});

app.MapGet("/api/proxy/users", async (HttpContext context) => {
    try {
        var contextService = context.RequestServices.GetRequiredService<BankingDbContext>();
        var users = await contextService.Users.ToListAsync();
        return Results.Ok(users);
    } catch (Exception ex) {
        return Results.Ok(new { error = ex.Message, users = new List<object>() });
    }
});

// Add OPTIONS handlers for proxy endpoints
app.MapMethods("/api/proxy/users", new[] { "OPTIONS" }, (HttpContext context) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
    context.Response.Headers["Access-Control-Max-Age"] = "86400";
    return Results.Ok();
});


// Add a simple test endpoint that doesn't require database
app.MapGet("/api/test-simple", () => new { message = "API is working", timestamp = DateTime.UtcNow });

// Add a CORS-free test endpoint
app.MapGet("/test-cors", () => new { 
    message = "CORS test successful", 
    timestamp = DateTime.UtcNow,
    corsHeaders = "Should work without CORS issues"
});

// Add a test endpoint to check users without going through the controller
app.MapGet("/api/test-users", async (HttpContext httpContext) => {
    try {
        var context = httpContext.RequestServices.GetRequiredService<BankingDbContext>();
        var users = await context.Users.ToListAsync();
        return Results.Ok(new { 
            message = "Users test successful", 
            userCount = users.Count,
            users = users,
            timestamp = DateTime.UtcNow 
        });
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "Users test failed", 
            error = ex.Message,
            stackTrace = ex.StackTrace,
            timestamp = DateTime.UtcNow 
        });
    }
});

// Add a test endpoint to check UserService directly
app.MapGet("/api/test-userservice", async (HttpContext httpContext) => {
    try {
        var userService = httpContext.RequestServices.GetRequiredService<IUserService>();
        var users = await userService.GetAllAsync();
        return Results.Ok(new { 
            message = "UserService test successful", 
            userCount = users.Count(),
            users = users,
            timestamp = DateTime.UtcNow 
        });
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "UserService test failed", 
            error = ex.Message,
            stackTrace = ex.StackTrace,
            timestamp = DateTime.UtcNow 
        });
    }
});

// Add a simple endpoint that returns empty users array (like the controller should)
app.MapGet("/api/users-simple", async (HttpContext httpContext) => {
    try {
        var context = httpContext.RequestServices.GetRequiredService<BankingDbContext>();
        var users = await context.Users.ToListAsync();
        
        // Return empty array if no users
        var userDtos = users.Select(u => new {
            id = u.Id,
            firstName = u.FirstName,
            lastName = u.LastName,
            email = u.Email,
            phoneNumber = u.PhoneNumber,
            dateOfBirth = u.DateOfBirth,
            address = u.Address,
            city = u.City,
            postalCode = u.PostalCode,
            country = u.Country,
            fullName = u.FullName,
            createdAt = u.CreatedAt,
            updatedAt = u.UpdatedAt
        });
        
        return Results.Ok(userDtos);
    } catch (Exception ex) {
        return Results.Ok(new { 
            message = "Users simple test failed", 
            error = ex.Message,
            stackTrace = ex.StackTrace,
            timestamp = DateTime.UtcNow 
        });
    }
});

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

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
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();

// Add a simple health check endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Add a simple test endpoint that doesn't require database
app.MapGet("/api/test-simple", () => new { message = "API is working", timestamp = DateTime.UtcNow });

// Add an endpoint to test database connection
app.MapGet("/api/test-db", async (IServiceProvider serviceProvider) => {
    try {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BankingDbContext>();
        var canConnect = await context.Database.CanConnectAsync();
        return new { 
            message = "Database connection test", 
            canConnect = canConnect,
            timestamp = DateTime.UtcNow 
        };
    } catch (Exception ex) {
        return new { 
            message = "Database connection failed", 
            error = ex.Message,
            timestamp = DateTime.UtcNow 
        };
    }
});

// Add an endpoint to initialize the database
app.MapPost("/api/init-db", async (IServiceProvider serviceProvider) => {
    try {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BankingDbContext>();
        await context.Database.EnsureCreatedAsync();
        return new { 
            message = "Database initialized successfully", 
            timestamp = DateTime.UtcNow 
        };
    } catch (Exception ex) {
        return new { 
            message = "Database initialization failed", 
            error = ex.Message,
            timestamp = DateTime.UtcNow 
        };
    }
});

app.MapControllers();

app.Run();

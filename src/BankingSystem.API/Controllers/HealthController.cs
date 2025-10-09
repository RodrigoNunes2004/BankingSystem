using Microsoft.AspNetCore.Mvc;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly BankingDbContext _context;

    public HealthController(BankingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { 
            Status = "Healthy", 
            Timestamp = DateTime.UtcNow,
            Message = "Banking System API is running"
        });
    }

    [HttpGet("database")]
    public async Task<IActionResult> TestDatabase()
    {
        try
        {
            // Test database connection
            var canConnect = await _context.Database.CanConnectAsync();
            
            if (canConnect)
            {
                return Ok(new { 
                    Status = "Database Connected", 
                    Message = "Database connection is working",
                    Timestamp = DateTime.UtcNow
                });
            }
            else
            {
                return BadRequest(new { 
                    Status = "Database Connection Failed", 
                    Message = "Cannot connect to database",
                    Timestamp = DateTime.UtcNow
                });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                Status = "Database Error", 
                Message = ex.Message,
                Timestamp = DateTime.UtcNow
            });
        }
    }

    [HttpPost("migrate")]
    public async Task<IActionResult> RunMigrations()
    {
        try
        {
            await _context.Database.MigrateAsync();
            return Ok(new { 
                Status = "Migrations Completed", 
                Message = "Database migrations have been applied successfully",
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                Status = "Migration Error", 
                Message = ex.Message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}

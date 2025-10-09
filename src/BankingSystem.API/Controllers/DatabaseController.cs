using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankingSystem.Infrastructure.Data;

namespace BankingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        private readonly BankingDbContext _context;

        public DatabaseController(BankingDbContext context)
        {
            _context = context;
        }

        [HttpPost("initialize")]
        public async Task<IActionResult> InitializeDatabase()
        {
            try
            {
                // Create database if it doesn't exist
                await _context.Database.EnsureCreatedAsync();
                
                return Ok(new { message = "Database initialized successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to initialize database", error = ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetDatabaseStatus()
        {
            try
            {
                // Test database connection
                var canConnect = await _context.Database.CanConnectAsync();
                
                return Ok(new { 
                    connected = canConnect,
                    message = canConnect ? "Database is connected" : "Database is not connected"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    connected = false,
                    message = "Database connection failed", 
                    error = ex.Message 
                });
            }
        }
    }
}



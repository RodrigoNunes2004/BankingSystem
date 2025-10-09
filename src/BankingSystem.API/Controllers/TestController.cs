using Microsoft.AspNetCore.Mvc;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly BankingDbContext _context;

        public TestController(BankingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Test()
        {
            try
            {
                // Test database connection
                var canConnect = await _context.Database.CanConnectAsync();
                
                if (canConnect)
                {
                    // Create database if it doesn't exist
                    await _context.Database.EnsureCreatedAsync();
                    
                    return Ok(new { 
                        message = "Database connected and created successfully",
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    return BadRequest(new { 
                        message = "Cannot connect to database",
                        timestamp = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Database error: " + ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}



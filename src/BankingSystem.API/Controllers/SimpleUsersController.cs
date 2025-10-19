using Microsoft.AspNetCore.Mvc;
using BankingSystem.Infrastructure.Data;
using BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimpleUsersController : ControllerBase
{
    private readonly BankingDbContext _context;

    public SimpleUsersController(BankingDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all users - simple version
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        // Add CORS headers manually
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        try
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return Ok(new List<object>());
        }
    }

    /// <summary>
    /// Create a new user - simple version
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] dynamic userData)
    {
        // Add CORS headers manually
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        try
        {
            var user = new User
            {
                FirstName = userData.firstName?.ToString() ?? "",
                LastName = userData.lastName?.ToString() ?? "",
                Email = userData.email?.ToString() ?? "",
                PhoneNumber = userData.phoneNumber?.ToString() ?? "",
                DateOfBirth = DateTime.TryParse(userData.dateOfBirth?.ToString(), out var dob) ? dob : DateTime.Now,
                Address = userData.address?.ToString() ?? "",
                City = userData.city?.ToString() ?? "",
                PostalCode = userData.postalCode?.ToString() ?? "",
                Country = userData.country?.ToString() ?? "",
                FullName = $"{userData.firstName} {userData.lastName}",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "User created successfully", 
                id = user.Id,
                user = user
            });
        }
        catch (Exception ex)
        {
            return Ok(new { message = "User creation failed", error = ex.Message });
        }
    }

    /// <summary>
    /// Handle CORS preflight requests
    /// </summary>
    [HttpOptions]
    public IActionResult Options()
    {
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return Ok();
    }
}

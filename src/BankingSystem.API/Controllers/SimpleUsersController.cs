using Microsoft.AspNetCore.Mvc;
using BankingSystem.Infrastructure.Data;
using BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        
        try
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        catch (Exception)
        {
            return Ok(new List<object>());
        }
    }

    /// <summary>
    /// Create a new user - simple version
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] JsonElement userData)
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        
        try
        {
            var user = new User
            {
                FirstName = userData.TryGetProperty("firstName", out var firstName) ? firstName.GetString() ?? "" : "",
                LastName = userData.TryGetProperty("lastName", out var lastName) ? lastName.GetString() ?? "" : "",
                Email = userData.TryGetProperty("email", out var email) ? email.GetString() ?? "" : "",
                PhoneNumber = userData.TryGetProperty("phoneNumber", out var phoneNumber) ? phoneNumber.GetString() ?? "" : "",
                DateOfBirth = userData.TryGetProperty("dateOfBirth", out var dateOfBirth) && DateTime.TryParse(dateOfBirth.GetString(), out DateTime dob) ? dob : DateTime.Now,
                Address = userData.TryGetProperty("address", out var address) ? address.GetString() ?? "" : "",
                City = userData.TryGetProperty("city", out var city) ? city.GetString() ?? "" : "",
                PostalCode = userData.TryGetProperty("postalCode", out var postalCode) ? postalCode.GetString() ?? "" : "",
                Country = userData.TryGetProperty("country", out var country) ? country.GetString() ?? "" : "",
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
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        return Ok();
    }
}

using Microsoft.AspNetCore.Mvc;
using BankingSystem.Infrastructure.Data;
using BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly BankingDbContext _context;

    public TestController(BankingDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
        
        try
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return Ok(new { error = ex.Message, users = new List<object>() });
        }
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
        
        try
        {
            var user = new User
            {
                FirstName = request.FirstName ?? "",
                LastName = request.LastName ?? "",
                Email = request.Email ?? "",
                PhoneNumber = request.PhoneNumber ?? "",
                DateOfBirth = request.DateOfBirth ?? DateTime.Now,
                Address = request.Address ?? "",
                City = request.City ?? "",
                PostalCode = request.PostalCode ?? "",
                Country = request.Country ?? "",
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

    [HttpOptions]
    public IActionResult Options()
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "*";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
        Response.Headers["Access-Control-Max-Age"] = "86400";
        return Ok();
    }
}

public class CreateUserRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}
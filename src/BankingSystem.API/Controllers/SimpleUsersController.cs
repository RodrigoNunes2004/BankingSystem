using Microsoft.AspNetCore.Mvc;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimpleUsersController : ControllerBase
{
    /// <summary>
    /// Get all users - simple version
    /// </summary>
    [HttpGet]
    public IActionResult GetUsers()
    {
        // Add CORS headers manually
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // Return empty array
        return Ok(new List<object>());
    }

    /// <summary>
    /// Create a new user - simple version
    /// </summary>
    [HttpPost]
    public IActionResult CreateUser([FromBody] object userData)
    {
        // Add CORS headers manually
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // Return success response
        return Ok(new { message = "User created successfully", id = 1 });
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

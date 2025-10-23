using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using BankingSystem.application.DTOs;
using BankingSystem.application.Services;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("VercelPolicy")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Handle CORS preflight requests
    /// </summary>
    [HttpOptions]
    public IActionResult Options()
    {
        Response.Headers["Access-Control-Allow-Origin"] = "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
        Response.Headers["Access-Control-Allow-Credentials"] = "true";
        Response.Headers["Access-Control-Max-Age"] = "86400";
        return Ok();
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    public Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
        Response.Headers["Access-Control-Allow-Credentials"] = "true";
        
        // Temporary fix: return empty array directly to bypass UserService issues
        return Task.FromResult<ActionResult<IEnumerable<UserDto>>>(Ok(new List<UserDto>()));
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    /// <summary>
    /// Get user by email
    /// </summary>
    [HttpGet("email/{email}")]
    public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
    {
        var user = await _userService.GetByEmailAsync(email);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
        Response.Headers["Access-Control-Allow-Credentials"] = "true";
        
        try
        {
            var user = await _userService.CreateAsync(createUserDto);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update user
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, UpdateUserDto updateUserDto)
    {
        try
        {
            var user = await _userService.UpdateAsync(id, updateUserDto);
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete user
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        try
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Check if user exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> UserExists(int id)
    {
        var exists = await _userService.ExistsAsync(id);
        return Ok(exists);
    }

    /// <summary>
    /// Check if email exists
    /// </summary>
    [HttpGet("email/{email}/exists")]
    public async Task<ActionResult<bool>> EmailExists(string email)
    {
        var exists = await _userService.EmailExistsAsync(email);
        return Ok(exists);
    }
}



using Microsoft.AspNetCore.Mvc;
using BankingSystem.application.DTOs;
using BankingSystem.application.Services;
using BankingSystem.Domain.Interfaces;
using BankingSystem.API.Services;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public AuthController(IUserService userService, IUserRepository userRepository, JwtService jwtService)
    {
        _userService = userService;
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Email))
            return Unauthorized(new { message = "Invalid email or password." });

        var user = await _userRepository.GetByEmailAsync(request.Email.Trim());
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var userDto = await _userService.GetByIdAsync(user.Id);
        if (userDto == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _jwtService.GenerateToken(userDto);
        return Ok(new AuthResponse { User = userDto, Token = token });
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] CreateUserDto request)
    {
        try
        {
            var user = await _userService.CreateAsync(request);
            var token = _jwtService.GenerateToken(user);
            return Ok(new AuthResponse { User = user, Token = token });
        }
        catch (InvalidOperationException ex)
        {
            return ex.Message.Contains("email already exists")
                ? Conflict(new { message = ex.Message })
                : BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Registration failed.", detail = ex.Message });
        }
    }

    /// <summary>
    /// Get current user from JWT (requires Authorization header)
    /// </summary>
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(user);
    }
}

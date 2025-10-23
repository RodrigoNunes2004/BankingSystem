using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using BankingSystem.application.DTOs;
using BankingSystem.application.Services;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("VercelPolicy")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
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
    /// Get all accounts
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccounts()
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
        Response.Headers["Access-Control-Allow-Credentials"] = "true";
        
        var accounts = await _accountService.GetAllAsync();
        return Ok(accounts);
    }

    /// <summary>
    /// Get account by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AccountDto>> GetAccount(int id)
    {
        var account = await _accountService.GetByIdAsync(id);
        if (account == null)
        {
            return NotFound();
        }
        return Ok(account);
    }

    /// <summary>
    /// Get account by account number
    /// </summary>
    [HttpGet("number/{accountNumber}")]
    public async Task<ActionResult<AccountDto>> GetAccountByNumber(string accountNumber)
    {
        var account = await _accountService.GetByAccountNumberAsync(accountNumber);
        if (account == null)
        {
            return NotFound();
        }
        return Ok(account);
    }

    /// <summary>
    /// Get accounts by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccountsByUser(int userId)
    {
        var accounts = await _accountService.GetByUserIdAsync(userId);
        return Ok(accounts);
    }

    /// <summary>
    /// Create a new account
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AccountDto>> CreateAccount(CreateAccountDto createAccountDto)
    {
        try
        {
            var account = await _accountService.CreateAsync(createAccountDto);
            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update account
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<AccountDto>> UpdateAccount(int id, UpdateAccountDto updateAccountDto)
    {
        try
        {
            var account = await _accountService.UpdateAsync(id, updateAccountDto);
            return Ok(account);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete account
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAccount(int id)
    {
        try
        {
            await _accountService.DeleteAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Check if account exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> AccountExists(int id)
    {
        var exists = await _accountService.ExistsAsync(id);
        return Ok(exists);
    }

    /// <summary>
    /// Check if account number exists
    /// </summary>
    [HttpGet("number/{accountNumber}/exists")]
    public async Task<ActionResult<bool>> AccountNumberExists(string accountNumber)
    {
        var exists = await _accountService.AccountNumberExistsAsync(accountNumber);
        return Ok(exists);
    }
}



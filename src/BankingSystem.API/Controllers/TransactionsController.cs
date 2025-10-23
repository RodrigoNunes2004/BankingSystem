using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using BankingSystem.application.DTOs;
using BankingSystem.application.Services;

namespace BankingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("VercelPolicy")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
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
    /// Get transaction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
    {
        var transaction = await _transactionService.GetByIdAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }
        return Ok(transaction);
    }

    /// <summary>
    /// Get transactions by account ID
    /// </summary>
    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByAccount(int accountId)
    {
        var transactions = await _transactionService.GetByAccountIdAsync(accountId);
        return Ok(transactions);
    }

    /// <summary>
    /// Get transactions by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByUser(int userId)
    {
        var transactions = await _transactionService.GetByUserIdAsync(userId);
        return Ok(transactions);
    }

    /// <summary>
    /// Get transactions by date range
    /// </summary>
    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByDateRange(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate)
    {
        // Add CORS headers manually
        Response.Headers["Access-Control-Allow-Origin"] = "https://banking-system-2r3e656qa-rodrigos-projects-2e367d33.vercel.app";
        Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
        Response.Headers["Access-Control-Allow-Credentials"] = "true";
        
        var transactions = await _transactionService.GetByDateRangeAsync(startDate, endDate);
        return Ok(transactions);
    }

    /// <summary>
    /// Create a new transaction
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransactionDto>> CreateTransaction(CreateTransactionDto createTransactionDto)
    {
        try
        {
            var transaction = await _transactionService.CreateAsync(createTransactionDto);
            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Process a deposit
    /// </summary>
    [HttpPost("deposit")]
    public async Task<ActionResult<TransactionDto>> ProcessDeposit([FromBody] DepositRequest request)
    {
        try
        {
            var transaction = await _transactionService.ProcessDepositAsync(
                request.AccountId, 
                request.Amount, 
                request.Description);
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Process a withdrawal
    /// </summary>
    [HttpPost("withdrawal")]
    public async Task<ActionResult<TransactionDto>> ProcessWithdrawal([FromBody] WithdrawalRequest request)
    {
        try
        {
            var transaction = await _transactionService.ProcessWithdrawalAsync(
                request.AccountId, 
                request.Amount, 
                request.Description);
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Process a transfer
    /// </summary>
    [HttpPost("transfer")]
    public async Task<ActionResult<TransactionDto>> ProcessTransfer(TransferDto transferDto)
    {
        try
        {
            var transaction = await _transactionService.ProcessTransferAsync(transferDto);
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update transaction
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TransactionDto>> UpdateTransaction(int id, CreateTransactionDto updateTransactionDto)
    {
        try
        {
            var transaction = await _transactionService.UpdateAsync(id, updateTransactionDto);
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete transaction
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTransaction(int id)
    {
        try
        {
            await _transactionService.DeleteAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Check if transaction exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> TransactionExists(int id)
    {
        var exists = await _transactionService.ExistsAsync(id);
        return Ok(exists);
    }
}

/// <summary>
/// Request model for deposit operations
/// </summary>
public class DepositRequest
{
    public int AccountId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}

/// <summary>
/// Request model for withdrawal operations
/// </summary>
public class WithdrawalRequest
{
    public int AccountId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}



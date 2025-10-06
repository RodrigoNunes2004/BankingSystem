using BankingSystem.application.DTOs;

namespace BankingSystem.application.Services;

/// <summary>
/// Service interface for Transaction operations
/// </summary>
public interface ITransactionService
{
    Task<TransactionDto?> GetByIdAsync(int id);
    Task<IEnumerable<TransactionDto>> GetByAccountIdAsync(int accountId);
    Task<IEnumerable<TransactionDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<TransactionDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<TransactionDto> CreateAsync(CreateTransactionDto createTransactionDto);
    Task<TransactionDto> ProcessDepositAsync(int accountId, decimal amount, string description);
    Task<TransactionDto> ProcessWithdrawalAsync(int accountId, decimal amount, string description);
    Task<TransactionDto> ProcessTransferAsync(TransferDto transferDto);
    Task<TransactionDto> UpdateAsync(int id, CreateTransactionDto updateTransactionDto);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}



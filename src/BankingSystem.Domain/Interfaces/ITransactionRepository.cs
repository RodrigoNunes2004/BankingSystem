using BankingSystem.Domain.Entities;

namespace BankingSystem.Domain.Interfaces;

/// <summary>
/// Repository interface for Transaction entity operations
/// </summary>
public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(int id);
    Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId);
    Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Transaction>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Transaction> CreateAsync(Transaction transaction);
    Task<Transaction> UpdateAsync(Transaction transaction);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}



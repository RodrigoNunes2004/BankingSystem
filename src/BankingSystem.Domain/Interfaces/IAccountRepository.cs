using BankingSystem.Domain.Entities;

namespace BankingSystem.Domain.Interfaces;

/// <summary>
/// Repository interface for Account entity operations
/// </summary>
public interface IAccountRepository
{
    Task<Account?> GetByIdAsync(int id);
    Task<Account?> GetByAccountNumberAsync(string accountNumber);
    Task<IEnumerable<Account>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Account>> GetAllAsync();
    Task<Account> CreateAsync(Account account);
    Task<Account> UpdateAsync(Account account);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> AccountNumberExistsAsync(string accountNumber);
}



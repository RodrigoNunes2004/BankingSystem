using BankingSystem.application.DTOs;

namespace BankingSystem.application.Services;

/// <summary>
/// Service interface for Account operations
/// </summary>
public interface IAccountService
{
    Task<AccountDto?> GetByIdAsync(int id);
    Task<AccountDto?> GetByAccountNumberAsync(string accountNumber);
    Task<IEnumerable<AccountDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<AccountDto>> GetAllAsync();
    Task<AccountDto> CreateAsync(CreateAccountDto createAccountDto);
    Task<AccountDto> UpdateAsync(int id, UpdateAccountDto updateAccountDto);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> AccountNumberExistsAsync(string accountNumber);
    Task<string> GenerateAccountNumberAsync();
}



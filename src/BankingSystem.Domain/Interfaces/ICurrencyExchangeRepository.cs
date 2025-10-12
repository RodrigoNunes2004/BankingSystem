using BankingSystem.Domain.Entities;

namespace BankingSystem.Domain.Interfaces
{
    public interface ICurrencyExchangeRepository
    {
        Task<IEnumerable<CurrencyExchange>> GetAllAsync();
        Task<CurrencyExchange?> GetByIdAsync(int id);
        Task<IEnumerable<CurrencyExchange>> GetByAccountIdAsync(int accountId);
        Task<IEnumerable<CurrencyExchange>> GetByUserIdAsync(int userId);
        Task<IEnumerable<CurrencyExchange>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<CurrencyExchange> AddAsync(CurrencyExchange currencyExchange);
        Task<CurrencyExchange> UpdateAsync(CurrencyExchange currencyExchange);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}

using BankingSystem.Domain.Entities;

namespace BankingSystem.Domain.Interfaces
{
    public interface IExchangeRateRepository
    {
        Task<IEnumerable<ExchangeRate>> GetAllAsync();
        Task<ExchangeRate?> GetByIdAsync(int id);
        Task<ExchangeRate?> GetByCurrencyPairAsync(string fromCurrency, string toCurrency);
        Task<IEnumerable<ExchangeRate>> GetActiveRatesAsync();
        Task<ExchangeRate> AddAsync(ExchangeRate exchangeRate);
        Task<ExchangeRate> UpdateAsync(ExchangeRate exchangeRate);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task UpdateRatesAsync(Dictionary<string, decimal> rates, string source = "API");
    }
}

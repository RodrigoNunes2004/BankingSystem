using BankingSystem.application.DTOs;

namespace BankingSystem.application.Services
{
    public interface ICurrencyExchangeService
    {
        Task<IEnumerable<CurrencyExchangeDto>> GetAllExchangesAsync();
        Task<CurrencyExchangeDto?> GetExchangeByIdAsync(int id);
        Task<IEnumerable<CurrencyExchangeDto>> GetExchangesByAccountIdAsync(int accountId);
        Task<IEnumerable<CurrencyExchangeDto>> GetExchangesByUserIdAsync(int userId);
        Task<IEnumerable<CurrencyExchangeDto>> GetExchangesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<CurrencyExchangeDto> CreateExchangeAsync(CreateCurrencyExchangeDto createDto);
        Task<CurrencyExchangeDto> UpdateExchangeAsync(int id, CreateCurrencyExchangeDto updateDto);
        Task DeleteExchangeAsync(int id);
        Task<bool> ExchangeExistsAsync(int id);
        Task<CurrencyConversionResponse> ConvertCurrencyAsync(CurrencyConversionRequest request);
        Task<decimal> GetExchangeRateAsync(string fromCurrency, string toCurrency);
        Task<IEnumerable<ExchangeRateDto>> GetAllExchangeRatesAsync();
        Task UpdateExchangeRatesAsync();
    }
}

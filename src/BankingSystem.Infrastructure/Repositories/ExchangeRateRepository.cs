using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Infrastructure.Repositories
{
    public class ExchangeRateRepository : IExchangeRateRepository
    {
        private readonly BankingDbContext _context;

        public ExchangeRateRepository(BankingDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExchangeRate>> GetAllAsync()
        {
            return await _context.ExchangeRates
                .Where(er => er.IsActive)
                .OrderBy(er => er.FromCurrency)
                .ThenBy(er => er.ToCurrency)
                .ToListAsync();
        }

        public async Task<ExchangeRate?> GetByIdAsync(int id)
        {
            return await _context.ExchangeRates
                .FirstOrDefaultAsync(er => er.Id == id && er.IsActive);
        }

        public async Task<ExchangeRate?> GetByCurrencyPairAsync(string fromCurrency, string toCurrency)
        {
            return await _context.ExchangeRates
                .FirstOrDefaultAsync(er => 
                    er.FromCurrency == fromCurrency.ToUpper() && 
                    er.ToCurrency == toCurrency.ToUpper() && 
                    er.IsActive);
        }

        public async Task<IEnumerable<ExchangeRate>> GetActiveRatesAsync()
        {
            return await _context.ExchangeRates
                .Where(er => er.IsActive)
                .OrderBy(er => er.FromCurrency)
                .ThenBy(er => er.ToCurrency)
                .ToListAsync();
        }

        public async Task<ExchangeRate> AddAsync(ExchangeRate exchangeRate)
        {
            exchangeRate.CreatedAt = DateTime.UtcNow;
            exchangeRate.IsActive = true;
            exchangeRate.FromCurrency = exchangeRate.FromCurrency.ToUpper();
            exchangeRate.ToCurrency = exchangeRate.ToCurrency.ToUpper();
            
            _context.ExchangeRates.Add(exchangeRate);
            await _context.SaveChangesAsync();
            return exchangeRate;
        }

        public async Task<ExchangeRate> UpdateAsync(ExchangeRate exchangeRate)
        {
            exchangeRate.UpdatedAt = DateTime.UtcNow;
            exchangeRate.FromCurrency = exchangeRate.FromCurrency.ToUpper();
            exchangeRate.ToCurrency = exchangeRate.ToCurrency.ToUpper();
            
            _context.ExchangeRates.Update(exchangeRate);
            await _context.SaveChangesAsync();
            return exchangeRate;
        }

        public async Task DeleteAsync(int id)
        {
            var exchangeRate = await _context.ExchangeRates.FindAsync(id);
            if (exchangeRate != null)
            {
                exchangeRate.IsActive = false;
                exchangeRate.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ExchangeRates
                .AnyAsync(er => er.Id == id && er.IsActive);
        }

        public async Task UpdateRatesAsync(Dictionary<string, decimal> rates, string source = "API")
        {
            var existingRates = await _context.ExchangeRates
                .Where(er => er.IsActive)
                .ToListAsync();

            foreach (var rate in rates)
            {
                var currencyPair = rate.Key.Split('_');
                if (currencyPair.Length == 2)
                {
                    var fromCurrency = currencyPair[0].ToUpper();
                    var toCurrency = currencyPair[1].ToUpper();

                    var existingRate = existingRates.FirstOrDefault(er => 
                        er.FromCurrency == fromCurrency && er.ToCurrency == toCurrency);

                    if (existingRate != null)
                    {
                        existingRate.Rate = rate.Value;
                        existingRate.LastUpdated = DateTime.UtcNow;
                        existingRate.Source = source;
                        _context.ExchangeRates.Update(existingRate);
                    }
                    else
                    {
                        var newRate = new ExchangeRate
                        {
                            FromCurrency = fromCurrency,
                            ToCurrency = toCurrency,
                            Rate = rate.Value,
                            LastUpdated = DateTime.UtcNow,
                            Source = source,
                            IsActive = true
                        };
                        _context.ExchangeRates.Add(newRate);
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}

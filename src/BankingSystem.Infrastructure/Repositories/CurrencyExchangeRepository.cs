using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Infrastructure.Repositories
{
    public class CurrencyExchangeRepository : ICurrencyExchangeRepository
    {
        private readonly BankingDbContext _context;

        public CurrencyExchangeRepository(BankingDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CurrencyExchange>> GetAllAsync()
        {
            return await _context.CurrencyExchanges
                .Include(ce => ce.FromAccount)
                .Include(ce => ce.ToAccount)
                .Where(ce => ce.IsActive)
                .OrderByDescending(ce => ce.CreatedAt)
                .ToListAsync();
        }

        public async Task<CurrencyExchange?> GetByIdAsync(int id)
        {
            return await _context.CurrencyExchanges
                .Include(ce => ce.FromAccount)
                .Include(ce => ce.ToAccount)
                .FirstOrDefaultAsync(ce => ce.Id == id && ce.IsActive);
        }

        public async Task<IEnumerable<CurrencyExchange>> GetByAccountIdAsync(int accountId)
        {
            return await _context.CurrencyExchanges
                .Include(ce => ce.FromAccount)
                .Include(ce => ce.ToAccount)
                .Where(ce => (ce.FromAccountId == accountId || ce.ToAccountId == accountId) && ce.IsActive)
                .OrderByDescending(ce => ce.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CurrencyExchange>> GetByUserIdAsync(int userId)
        {
            return await _context.CurrencyExchanges
                .Include(ce => ce.FromAccount)
                .Include(ce => ce.ToAccount)
                .Where(ce => (ce.FromAccount.UserId == userId || ce.ToAccount.UserId == userId) && ce.IsActive)
                .OrderByDescending(ce => ce.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CurrencyExchange>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.CurrencyExchanges
                .Include(ce => ce.FromAccount)
                .Include(ce => ce.ToAccount)
                .Where(ce => ce.ExchangeDate >= startDate && ce.ExchangeDate <= endDate && ce.IsActive)
                .OrderByDescending(ce => ce.ExchangeDate)
                .ToListAsync();
        }

        public async Task<CurrencyExchange> AddAsync(CurrencyExchange currencyExchange)
        {
            currencyExchange.CreatedAt = DateTime.UtcNow;
            currencyExchange.IsActive = true;
            
            _context.CurrencyExchanges.Add(currencyExchange);
            await _context.SaveChangesAsync();
            return currencyExchange;
        }

        public async Task<CurrencyExchange> UpdateAsync(CurrencyExchange currencyExchange)
        {
            currencyExchange.UpdatedAt = DateTime.UtcNow;
            _context.CurrencyExchanges.Update(currencyExchange);
            await _context.SaveChangesAsync();
            return currencyExchange;
        }

        public async Task DeleteAsync(int id)
        {
            var currencyExchange = await _context.CurrencyExchanges.FindAsync(id);
            if (currencyExchange != null)
            {
                currencyExchange.IsActive = false;
                currencyExchange.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.CurrencyExchanges
                .AnyAsync(ce => ce.Id == id && ce.IsActive);
        }
    }
}

using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Account entity
/// </summary>
public class AccountRepository : IAccountRepository
{
    private readonly BankingDbContext _context;

    public AccountRepository(BankingDbContext context)
    {
        _context = context;
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts
            .Include(a => a.User)
            .Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);
    }

    public async Task<Account?> GetByAccountNumberAsync(string accountNumber)
    {
        return await _context.Accounts
            .Include(a => a.User)
            .Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber && a.IsActive);
    }

    public async Task<IEnumerable<Account>> GetByUserIdAsync(int userId)
    {
        return await _context.Accounts
            .Include(a => a.User)
            .Include(a => a.Transactions)
            .Where(a => a.UserId == userId && a.IsActive)
            .ToListAsync();
    }

    public async Task<IEnumerable<Account>> GetAllAsync()
    {
        return await _context.Accounts
            .Include(a => a.User)
            .Include(a => a.Transactions)
            .Where(a => a.IsActive)
            .ToListAsync();
    }

    public async Task<Account> CreateAsync(Account account)
    {
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        account.UpdatedAt = DateTime.UtcNow;
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task DeleteAsync(int id)
    {
        var account = await _context.Accounts.FindAsync(id);
        if (account != null)
        {
            account.IsActive = false;
            account.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Accounts.AnyAsync(a => a.Id == id && a.IsActive);
    }

    public async Task<bool> AccountNumberExistsAsync(string accountNumber)
    {
        return await _context.Accounts.AnyAsync(a => a.AccountNumber == accountNumber && a.IsActive);
    }
}



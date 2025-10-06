using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;
using BankingSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Transaction entity
/// </summary>
public class TransactionRepository : ITransactionRepository
{
    private readonly BankingDbContext _context;

    public TransactionRepository(BankingDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(int id)
    {
        return await _context.Transactions
            .Include(t => t.Account)
            .Include(t => t.ToAccount)
            .FirstOrDefaultAsync(t => t.Id == id && t.IsActive);
    }

    public async Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId)
    {
        return await _context.Transactions
            .Include(t => t.Account)
            .Include(t => t.ToAccount)
            .Where(t => t.AccountId == accountId && t.IsActive)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId)
    {
        return await _context.Transactions
            .Include(t => t.Account)
            .Include(t => t.ToAccount)
            .Where(t => t.Account.UserId == userId && t.IsActive)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Transactions
            .Include(t => t.Account)
            .Include(t => t.ToAccount)
            .Where(t => t.TransactionDate >= startDate && t.TransactionDate <= endDate && t.IsActive)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }

    public async Task<Transaction> CreateAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<Transaction> UpdateAsync(Transaction transaction)
    {
        transaction.UpdatedAt = DateTime.UtcNow;
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task DeleteAsync(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction != null)
        {
            transaction.IsActive = false;
            transaction.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Transactions.AnyAsync(t => t.Id == id && t.IsActive);
    }
}



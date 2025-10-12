using BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Infrastructure.Data;

/// <summary>
/// Database context for the banking system
/// </summary>
public class BankingDbContext : DbContext
{
    public BankingDbContext(DbContextOptions<BankingDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<CurrencyExchange> CurrencyExchanges { get; set; }
    public DbSet<ExchangeRate> ExchangeRates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.Property(e => e.City).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(50);
        });

        // Account configuration
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AccountNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.AccountNumber).IsUnique();
            entity.Property(e => e.AccountType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Balance).HasColumnType("decimal(18,2)");
            entity.Property(e => e.AvailableBalance).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("USD");

            // Foreign key relationship
            entity.HasOne(e => e.User)
                  .WithMany(e => e.Accounts)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
            entity.Property(e => e.ReferenceNumber).HasMaxLength(100);
            entity.Property(e => e.Category).HasMaxLength(50);

            // Foreign key relationships
            entity.HasOne(e => e.Account)
                  .WithMany(e => e.Transactions)
                  .HasForeignKey(e => e.AccountId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ToAccount)
                  .WithMany()
                  .HasForeignKey(e => e.ToAccountId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // CurrencyExchange configuration
        modelBuilder.Entity<CurrencyExchange>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FromCurrency).IsRequired().HasMaxLength(3);
            entity.Property(e => e.ToCurrency).IsRequired().HasMaxLength(3);
            entity.Property(e => e.ExchangeRate).HasColumnType("decimal(18,6)");
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ConvertedAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Fee).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Completed");

            // Foreign key relationships
            entity.HasOne(e => e.FromAccount)
                  .WithMany()
                  .HasForeignKey(e => e.FromAccountId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ToAccount)
                  .WithMany()
                  .HasForeignKey(e => e.ToAccountId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ExchangeRate configuration
        modelBuilder.Entity<ExchangeRate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FromCurrency).IsRequired().HasMaxLength(3);
            entity.Property(e => e.ToCurrency).IsRequired().HasMaxLength(3);
            entity.Property(e => e.Rate).HasColumnType("decimal(18,6)");
            entity.Property(e => e.Source).HasMaxLength(100);

            // Unique constraint for currency pair
            entity.HasIndex(e => new { e.FromCurrency, e.ToCurrency }).IsUnique();
        });
    }
}



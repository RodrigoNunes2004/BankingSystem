using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Domain.Entities;

/// <summary>
/// Represents a bank account
/// </summary>
public class Account : BaseEntity
{
    [Required]
    [StringLength(20)]
    public string AccountNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string AccountType { get; set; } = string.Empty; // Savings, Checking, Business, etc.

    [Required]
    public decimal Balance { get; set; }

    [Required]
    public decimal AvailableBalance { get; set; }

    [Required]
    public int UserId { get; set; }

    [StringLength(3)]
    public string Currency { get; set; } = "USD";

    public bool IsLocked { get; set; } = false;

    public DateTime? LastTransactionDate { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}



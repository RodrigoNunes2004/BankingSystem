using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Domain.Entities;

/// <summary>
/// Represents a financial transaction
/// </summary>
public class Transaction : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string TransactionType { get; set; } = string.Empty; // Deposit, Withdrawal, Transfer, Payment

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public int AccountId { get; set; }

    public int? ToAccountId { get; set; } // For transfers

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [StringLength(50)]
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed, Cancelled

    [StringLength(100)]
    public string ReferenceNumber { get; set; } = string.Empty;

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    [StringLength(50)]
    public string Category { get; set; } = string.Empty; // Food, Transport, Entertainment, etc.

    // Navigation properties
    public virtual Account Account { get; set; } = null!;
    public virtual Account? ToAccount { get; set; }
}



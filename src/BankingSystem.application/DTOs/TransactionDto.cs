namespace BankingSystem.application.DTOs;

/// <summary>
/// Data Transfer Object for Transaction
/// </summary>
public class TransactionDto
{
    public int Id { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int AccountId { get; set; }
    public int? ToAccountId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ReferenceNumber { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string? ToAccountNumber { get; set; }
}

/// <summary>
/// Data Transfer Object for creating a new Transaction
/// </summary>
public class CreateTransactionDto
{
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int AccountId { get; set; }
    public int? ToAccountId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Data Transfer Object for transfer operations
/// </summary>
public class TransferDto
{
    public int FromAccountId { get; set; }
    public int ToAccountId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}



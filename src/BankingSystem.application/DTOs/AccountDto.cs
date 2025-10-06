namespace BankingSystem.application.DTOs;

/// <summary>
/// Data Transfer Object for Account
/// </summary>
public class AccountDto
{
    public int Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public decimal AvailableBalance { get; set; }
    public int UserId { get; set; }
    public string Currency { get; set; } = string.Empty;
    public bool IsLocked { get; set; }
    public DateTime? LastTransactionDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
}

/// <summary>
/// Data Transfer Object for creating a new Account
/// </summary>
public class CreateAccountDto
{
    public string AccountType { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Currency { get; set; } = "USD";
}

/// <summary>
/// Data Transfer Object for updating an Account
/// </summary>
public class UpdateAccountDto
{
    public string AccountType { get; set; } = string.Empty;
    public bool IsLocked { get; set; }
}



using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Domain.Entities;

/// <summary>
/// Represents a user in the banking system
/// </summary>
public class User : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Country { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}";

    // Navigation properties
    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}



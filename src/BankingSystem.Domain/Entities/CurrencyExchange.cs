using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Domain.Entities
{
    public class CurrencyExchange : BaseEntity
    {
        [Required]
        [StringLength(3)]
        public string FromCurrency { get; set; } = string.Empty;

        [Required]
        [StringLength(3)]
        public string ToCurrency { get; set; } = string.Empty;

        [Required]
        public decimal ExchangeRate { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public decimal ConvertedAmount { get; set; }

        [Required]
        public decimal Fee { get; set; }

        [Required]
        public int FromAccountId { get; set; }

        [Required]
        public int ToAccountId { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime ExchangeDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Completed";

        // Navigation properties
        public virtual Account FromAccount { get; set; } = null!;
        public virtual Account ToAccount { get; set; } = null!;
    }
}

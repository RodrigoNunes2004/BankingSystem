using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Domain.Entities
{
    public class ExchangeRate : BaseEntity
    {
        [Required]
        [StringLength(3)]
        public string FromCurrency { get; set; } = string.Empty;

        [Required]
        [StringLength(3)]
        public string ToCurrency { get; set; } = string.Empty;

        [Required]
        public decimal Rate { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; }

        [StringLength(100)]
        public string? Source { get; set; }

        public bool IsActive { get; set; } = true;
    }
}

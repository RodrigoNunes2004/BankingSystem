namespace BankingSystem.application.DTOs
{
    public class CurrencyExchangeDto
    {
        public int Id { get; set; }
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public decimal ExchangeRate { get; set; }
        public decimal Amount { get; set; }
        public decimal ConvertedAmount { get; set; }
        public decimal Fee { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string? Description { get; set; }
        public DateTime ExchangeDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCurrencyExchangeDto
    {
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string? Description { get; set; }
    }

    public class ExchangeRateDto
    {
        public int Id { get; set; }
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public decimal Rate { get; set; }
        public DateTime LastUpdated { get; set; }
        public string? Source { get; set; }
        public bool IsActive { get; set; }
    }

    public class CurrencyConversionRequest
    {
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class CurrencyConversionResponse
    {
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal ConvertedAmount { get; set; }
        public decimal Fee { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}

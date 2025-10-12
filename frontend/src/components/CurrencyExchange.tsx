import React, { useState, useEffect } from "react";
import { Account } from "../services/api";

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  exchangeRate: number;
  convertedAmount: number;
  fee: number;
  totalAmount: number;
}

const CurrencyExchange: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'rates'>('buy');
  
  // Exchange form state
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'NZD', 'AUD', 'BRL'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use mock accounts data instead of API call
      const mockAccounts = [
        {
          id: 1,
          accountNumber: "7559546839",
          accountType: "Checking",
          balance: 8200.00,
          availableBalance: 8200.00,
          userId: 1,
          currency: "USD",
          isLocked: false,
          userName: "John Doe",
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          id: 2,
          accountNumber: "6275708843",
          accountType: "Savings",
          balance: 1600.00,
          availableBalance: 1600.00,
          userId: 1,
          currency: "USD",
          isLocked: false,
          userName: "John Doe",
          createdAt: "2024-01-01T00:00:00Z"
        }
      ];
      setAccounts(mockAccounts);
      
      // Mock exchange rates for now (we'll implement real API later)
      setExchangeRates([
        { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.73, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'USD', toCurrency: 'NZD', rate: 1.45, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'USD', toCurrency: 'AUD', rate: 1.35, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'USD', toCurrency: 'BRL', rate: 5.20, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.18, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'GBP', toCurrency: 'USD', rate: 1.37, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'NZD', toCurrency: 'USD', rate: 0.69, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'AUD', toCurrency: 'USD', rate: 0.74, lastUpdated: new Date().toISOString() },
        { fromCurrency: 'BRL', toCurrency: 'USD', rate: 0.19, lastUpdated: new Date().toISOString() },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateConversion = async () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    setIsCalculating(true);
    try {
      // Find exchange rate
      const rate = exchangeRates.find(
        r => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
      );

      if (!rate) {
        setError(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
        return;
      }

      const amountNum = parseFloat(amount);
      const convertedAmount = amountNum * rate.rate;
      const fee = Math.max(convertedAmount * 0.01, 5); // 1% fee, minimum $5
      const totalAmount = convertedAmount - fee;

      setConversion({
        fromCurrency,
        toCurrency,
        amount: amountNum,
        exchangeRate: rate.rate,
        convertedAmount,
        fee,
        totalAmount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleExchange = async () => {
    if (!conversion || !fromAccount || !toAccount) return;

    try {
      // Here we would call the actual exchange API
      alert(`Exchange successful! ${conversion.amount} ${conversion.fromCurrency} converted to ${conversion.totalAmount.toFixed(2)} ${conversion.toCurrency}`);
      
      // Reset form
      setAmount('');
      setConversion(null);
      setFromAccount('');
      setToAccount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Exchange failed");
    }
  };

  const getExchangeRate = (from: string, to: string) => {
    const rate = exchangeRates.find(r => r.fromCurrency === from && r.toCurrency === to);
    return rate ? rate.rate : 0;
  };

  if (loading) return <div className="loading">Loading currency exchange...</div>;

  return (
    <div className="main-content">
      <h2>Currency Exchange</h2>
      
      {error && <div className="error">Error: {error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buy')}
          data-icon="💱"
        >
          <span>Buy Currency</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'sell' ? 'active' : ''}`}
          onClick={() => setActiveTab('sell')}
          data-icon="💸"
        >
          <span>Sell Currency</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'rates' ? 'active' : ''}`}
          onClick={() => setActiveTab('rates')}
          data-icon="📊"
        >
          <span>Exchange Rates</span>
        </button>
      </div>

      {activeTab === 'buy' && (
        <div className="exchange-form">
          <h3>Buy Currency</h3>
          <div className="form-row">
            <div className="form-group">
              <label>From Account</label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                <option value="">Select account to buy from</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Account</label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              >
                <option value="">Select account to buy into</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                required
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                required
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Amount to Exchange</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={calculateConversion}
            disabled={!amount || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Exchange'}
          </button>

          {conversion && (
            <div className="conversion-result">
              <h4>Exchange Calculation</h4>
              <div className="conversion-details">
                <div className="conversion-row">
                  <span>Amount:</span>
                  <span>{conversion.amount} {conversion.fromCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Rate:</span>
                  <span>1 {conversion.fromCurrency} = {conversion.exchangeRate} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Converted Amount:</span>
                  <span>{conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Fee (1%):</span>
                  <span>-{conversion.fee.toFixed(2)} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row total">
                  <span>You Will Receive:</span>
                  <span>{conversion.totalAmount.toFixed(2)} {conversion.toCurrency}</span>
                </div>
              </div>
              <button
                className="btn btn-success"
                onClick={handleExchange}
                disabled={!fromAccount || !toAccount}
              >
                Confirm Exchange
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sell' && (
        <div className="exchange-form">
          <h3>Sell Currency</h3>
          <div className="form-row">
            <div className="form-group">
              <label>From Account</label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                <option value="">Select account to sell from</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Account</label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              >
                <option value="">Select account to sell into</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                required
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                required
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Amount to Exchange</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={calculateConversion}
            disabled={!amount || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Exchange'}
          </button>

          {conversion && (
            <div className="conversion-result">
              <h4>Exchange Calculation</h4>
              <div className="conversion-details">
                <div className="conversion-row">
                  <span>Amount:</span>
                  <span>{conversion.amount} {conversion.fromCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Rate:</span>
                  <span>1 {conversion.fromCurrency} = {conversion.exchangeRate} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Converted Amount:</span>
                  <span>{conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Fee (1%):</span>
                  <span>-{conversion.fee.toFixed(2)} {conversion.toCurrency}</span>
                </div>
                <div className="conversion-row total">
                  <span>You Will Receive:</span>
                  <span>{conversion.totalAmount.toFixed(2)} {conversion.toCurrency}</span>
                </div>
              </div>
              <button
                className="btn btn-success"
                onClick={handleExchange}
                disabled={!fromAccount || !toAccount}
              >
                Confirm Exchange
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="exchange-rates">
          <h3>Current Exchange Rates</h3>
          <div className="rates-grid">
            {currencies.map(fromCurrency => (
              <div key={fromCurrency} className="currency-rates">
                <h4>{fromCurrency} Exchange Rates</h4>
                {currencies
                  .filter(toCurrency => toCurrency !== fromCurrency)
                  .map(toCurrency => {
                    const rate = getExchangeRate(fromCurrency, toCurrency);
                    return (
                      <div key={toCurrency} className="rate-item">
                        <span className="currency-pair">{fromCurrency}/{toCurrency}</span>
                        <span className="rate-value">{rate.toFixed(4)}</span>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;

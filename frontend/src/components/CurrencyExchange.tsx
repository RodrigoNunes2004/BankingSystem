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
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "rates">("buy");

  // Exchange form state
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const currencies = ["USD", "EUR", "GBP", "NZD", "AUD", "BRL"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get current user
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        setError("Please login first!");
        return;
      }

      // Load user's actual accounts from localStorage
      const userAccounts = JSON.parse(
        localStorage.getItem(`banking_accounts_${currentUser.id}`) || "[]"
      );
      setAccounts(userAccounts);

      console.log("✅ CURRENCY EXCHANGE - Loaded user accounts:", userAccounts);

      // Mock exchange rates for now (we'll implement real API later)
      setExchangeRates([
        // USD rates
        {
          fromCurrency: "USD",
          toCurrency: "EUR",
          rate: 0.85,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "USD",
          toCurrency: "GBP",
          rate: 0.73,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "USD",
          toCurrency: "NZD",
          rate: 1.45,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "USD",
          toCurrency: "AUD",
          rate: 1.35,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "USD",
          toCurrency: "BRL",
          rate: 5.2,
          lastUpdated: new Date().toISOString(),
        },

        // EUR rates
        {
          fromCurrency: "EUR",
          toCurrency: "USD",
          rate: 1.18,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "EUR",
          toCurrency: "GBP",
          rate: 0.86,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "EUR",
          toCurrency: "NZD",
          rate: 1.71,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "EUR",
          toCurrency: "AUD",
          rate: 1.59,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "EUR",
          toCurrency: "BRL",
          rate: 6.12,
          lastUpdated: new Date().toISOString(),
        },

        // GBP rates
        {
          fromCurrency: "GBP",
          toCurrency: "USD",
          rate: 1.37,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "GBP",
          toCurrency: "EUR",
          rate: 1.16,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "GBP",
          toCurrency: "NZD",
          rate: 1.99,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "GBP",
          toCurrency: "AUD",
          rate: 1.85,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "GBP",
          toCurrency: "BRL",
          rate: 7.12,
          lastUpdated: new Date().toISOString(),
        },

        // NZD rates
        {
          fromCurrency: "NZD",
          toCurrency: "USD",
          rate: 0.69,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "NZD",
          toCurrency: "EUR",
          rate: 0.58,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "NZD",
          toCurrency: "GBP",
          rate: 0.5,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "NZD",
          toCurrency: "AUD",
          rate: 0.93,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "NZD",
          toCurrency: "BRL",
          rate: 3.58,
          lastUpdated: new Date().toISOString(),
        },

        // AUD rates
        {
          fromCurrency: "AUD",
          toCurrency: "USD",
          rate: 0.74,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "AUD",
          toCurrency: "EUR",
          rate: 0.63,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "AUD",
          toCurrency: "GBP",
          rate: 0.54,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "AUD",
          toCurrency: "NZD",
          rate: 1.08,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "AUD",
          toCurrency: "BRL",
          rate: 3.85,
          lastUpdated: new Date().toISOString(),
        },

        // BRL rates
        {
          fromCurrency: "BRL",
          toCurrency: "USD",
          rate: 0.19,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "BRL",
          toCurrency: "EUR",
          rate: 0.16,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "BRL",
          toCurrency: "GBP",
          rate: 0.14,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "BRL",
          toCurrency: "NZD",
          rate: 0.28,
          lastUpdated: new Date().toISOString(),
        },
        {
          fromCurrency: "BRL",
          toCurrency: "AUD",
          rate: 0.26,
          lastUpdated: new Date().toISOString(),
        },
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
        (r) => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
      );

      if (!rate) {
        setError(
          `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
        );
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
        totalAmount,
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
      // Get current user
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        alert("Please login first!");
        return;
      }

      // Create currency exchange transaction
      const transaction = {
        id: Date.now(),
        transactionType: "CURRENCY_EXCHANGE",
        amount: conversion.amount,
        fromAccountId: parseInt(fromAccount),
        toAccountId: parseInt(toAccount),
        fromCurrency: conversion.fromCurrency,
        toCurrency: conversion.toCurrency,
        exchangeRate: conversion.exchangeRate,
        convertedAmount: conversion.convertedAmount,
        fee: conversion.fee,
        totalAmount: conversion.totalAmount,
        description: `Currency exchange: ${conversion.amount} ${
          conversion.fromCurrency
        } to ${conversion.totalAmount.toFixed(2)} ${conversion.toCurrency}`,
        status: "Completed",
        transactionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        referenceNumber: `EXC${Math.floor(1000 + Math.random() * 9000)}`,
        accountNumber:
          accounts.find((a) => a.id === parseInt(fromAccount))?.accountNumber ||
          "",
        category: "Currency Exchange",
      };

      // Save transaction to localStorage
      const userTransactions = JSON.parse(
        localStorage.getItem(`banking_transactions_${currentUser.id}`) || "[]"
      );
      userTransactions.push(transaction);
      localStorage.setItem(
        `banking_transactions_${currentUser.id}`,
        JSON.stringify(userTransactions)
      );

      // Update account balances
      const userAccounts = JSON.parse(
        localStorage.getItem(`banking_accounts_${currentUser.id}`) || "[]"
      );

      // Deduct from source account
      const fromAccountIndex = userAccounts.findIndex(
        (a: any) => a.id === parseInt(fromAccount)
      );
      if (fromAccountIndex !== -1) {
        userAccounts[fromAccountIndex].balance -= conversion.amount;
        userAccounts[fromAccountIndex].availableBalance -= conversion.amount;
      }

      // Add to destination account
      const toAccountIndex = userAccounts.findIndex(
        (a: any) => a.id === parseInt(toAccount)
      );
      if (toAccountIndex !== -1) {
        userAccounts[toAccountIndex].balance += conversion.totalAmount;
        userAccounts[toAccountIndex].availableBalance += conversion.totalAmount;
        // Update currency if different
        if (userAccounts[toAccountIndex].currency !== conversion.toCurrency) {
          userAccounts[toAccountIndex].currency = conversion.toCurrency;
        }
      }

      // Save updated accounts
      localStorage.setItem(
        `banking_accounts_${currentUser.id}`,
        JSON.stringify(userAccounts)
      );

      console.log("✅ CURRENCY EXCHANGE SUCCESS:", transaction);
      console.log("✅ UPDATED ACCOUNTS:", userAccounts);

      alert(
        `Exchange successful! ${conversion.amount} ${
          conversion.fromCurrency
        } converted to ${conversion.totalAmount.toFixed(2)} ${
          conversion.toCurrency
        }`
      );

      // Reset form
      setAmount("");
      setConversion(null);
      setFromAccount("");
      setToAccount("");

      // Refresh accounts data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Exchange failed");
    }
  };

  const getExchangeRate = (from: string, to: string) => {
    const rate = exchangeRates.find(
      (r) => r.fromCurrency === from && r.toCurrency === to
    );
    return rate ? rate.rate : 0;
  };

  if (loading)
    return <div className="loading">Loading currency exchange...</div>;

  return (
    <div className="main-content">
      <h2>Currency Exchange</h2>

      {error && <div className="error">Error: {error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "buy" ? "active" : ""}`}
          onClick={() => setActiveTab("buy")}
          data-icon="💱"
        >
          <span>Buy Currency</span>
        </button>
        <button
          className={`tab-button ${activeTab === "sell" ? "active" : ""}`}
          onClick={() => setActiveTab("sell")}
          data-icon="💸"
        >
          <span>Sell Currency</span>
        </button>
        <button
          className={`tab-button ${activeTab === "rates" ? "active" : ""}`}
          onClick={() => setActiveTab("rates")}
          data-icon="📊"
        >
          <span>Exchange Rates</span>
        </button>
      </div>

      {activeTab === "buy" && (
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
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency} ($
                    {account.balance.toFixed(2)})
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
                {accounts.map((account) => (
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
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
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
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
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
            {isCalculating ? "Calculating..." : "Calculate Exchange"}
          </button>

          {conversion && (
            <div className="conversion-result">
              <h4>Exchange Calculation</h4>
              <div className="conversion-details">
                <div className="conversion-row">
                  <span>Amount:</span>
                  <span>
                    {conversion.amount} {conversion.fromCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Rate:</span>
                  <span>
                    1 {conversion.fromCurrency} = {conversion.exchangeRate}{" "}
                    {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Converted Amount:</span>
                  <span>
                    {conversion.convertedAmount.toFixed(2)}{" "}
                    {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Fee (1%):</span>
                  <span>
                    -{conversion.fee.toFixed(2)} {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row total">
                  <span>You Will Receive:</span>
                  <span>
                    {conversion.totalAmount.toFixed(2)} {conversion.toCurrency}
                  </span>
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

      {activeTab === "sell" && (
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
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.currency} ($
                    {account.balance.toFixed(2)})
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
                {accounts.map((account) => (
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
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
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
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
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
            {isCalculating ? "Calculating..." : "Calculate Exchange"}
          </button>

          {conversion && (
            <div className="conversion-result">
              <h4>Exchange Calculation</h4>
              <div className="conversion-details">
                <div className="conversion-row">
                  <span>Amount:</span>
                  <span>
                    {conversion.amount} {conversion.fromCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Rate:</span>
                  <span>
                    1 {conversion.fromCurrency} = {conversion.exchangeRate}{" "}
                    {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Converted Amount:</span>
                  <span>
                    {conversion.convertedAmount.toFixed(2)}{" "}
                    {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row">
                  <span>Exchange Fee (1%):</span>
                  <span>
                    -{conversion.fee.toFixed(2)} {conversion.toCurrency}
                  </span>
                </div>
                <div className="conversion-row total">
                  <span>You Will Receive:</span>
                  <span>
                    {conversion.totalAmount.toFixed(2)} {conversion.toCurrency}
                  </span>
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

      {activeTab === "rates" && (
        <div className="exchange-rates">
          <h3>Current Exchange Rates</h3>
          <div className="rates-grid">
            {currencies.map((fromCurrency) => (
              <div key={fromCurrency} className="currency-rates">
                <h4>{fromCurrency} Exchange Rates</h4>
                {currencies
                  .filter((toCurrency) => toCurrency !== fromCurrency)
                  .map((toCurrency) => {
                    const rate = getExchangeRate(fromCurrency, toCurrency);
                    return (
                      <div key={toCurrency} className="rate-item">
                        <span className="currency-pair">
                          {fromCurrency}/{toCurrency}
                        </span>
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

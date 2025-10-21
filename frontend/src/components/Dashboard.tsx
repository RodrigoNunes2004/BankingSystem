import React, { useState, useEffect } from "react";
import { apiService, User, Account, Transaction } from "../services/api-simple";

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, accountsData, transactionsData] = await Promise.all([
          apiService.getUsers(),
          apiService.getAccounts(),
          apiService.getTransactionsByDateRange(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            new Date().toISOString()
          ),
        ]);
        setUsers(usersData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Accounts</h3>
          <p className="stat-number">{accounts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p className="stat-number">${totalBalance.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Recent Transactions</h3>
          <p className="stat-number">{transactions.length}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h3>Recent Transactions</h3>
          <div className="transaction-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">
                    {transaction.transactionType}
                  </span>
                  <span className="transaction-amount">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-date">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </span>
                  <span className="transaction-status">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Account Summary</h3>
          <div className="account-list">
            {accounts.slice(0, 5).map((account) => (
              <div key={account.id} className="account-item">
                <div className="account-info">
                  <span className="account-number">
                    {account.accountNumber}
                  </span>
                  <span className="account-type">{account.accountType}</span>
                </div>
                <div className="account-balance">
                  ${account.balance.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



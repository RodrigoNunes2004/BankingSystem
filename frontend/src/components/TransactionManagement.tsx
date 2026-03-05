import React, { useState, useEffect } from "react";
import {
  apiService,
  Transaction,
  Account,
  DepositRequest,
  WithdrawalRequest,
  TransferRequest,
} from "../services/api";
import ResponsiveTable from "./ResponsiveTable";

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const [depositForm, setDepositForm] = useState<DepositRequest>({
    accountId: 0,
    amount: 0,
    description: "",
  });

  const [withdrawalForm, setWithdrawalForm] = useState<WithdrawalRequest>({
    accountId: 0,
    amount: 0,
    description: "",
  });

  const [transferForm, setTransferForm] = useState<TransferRequest>({
    fromAccountId: 0,
    toAccountId: 0,
    amount: 0,
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        setError("Please login first!");
        return;
      }

      // Accounts: API first, fallback to localStorage
      let accountsData: Account[] = [];
      try {
        accountsData = await apiService.getAccounts();
        localStorage.setItem(
          `banking_accounts_${currentUser.id}`,
          JSON.stringify(accountsData)
        );
      } catch {
        accountsData = JSON.parse(
          localStorage.getItem(`banking_accounts_${currentUser.id}`) || "[]"
        );
      }
      setAccounts(accountsData);

      // Transactions: API first, fallback to localStorage
      let transactionsData: Transaction[] = [];
      try {
        transactionsData = await apiService.getTransactionsByUser(currentUser.id);
        localStorage.setItem(
          `banking_transactions_${currentUser.id}`,
          JSON.stringify(transactionsData)
        );
      } catch {
        transactionsData = JSON.parse(
          localStorage.getItem(`banking_transactions_${currentUser.id}`) || "[]"
        );
      }
      setTransactions(transactionsData);

      setError(null);
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        alert("Please login first!");
        return;
      }
      if (depositForm.accountId === 0) {
        alert("Please select an account!");
        return;
      }

      await apiService.processDeposit(depositForm);
      setDepositForm({ accountId: 0, amount: 0, description: "" });
      await fetchData();
      alert("Deposit processed successfully!");
      setActiveTab("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        alert("Please login first!");
        return;
      }
      if (withdrawalForm.accountId === 0) {
        alert("Please select an account!");
        return;
      }

      await apiService.processWithdrawal(withdrawalForm);
      setWithdrawalForm({ accountId: 0, amount: 0, description: "" });
      await fetchData();
      alert("Withdrawal processed successfully!");
      setActiveTab("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        alert("Please login first!");
        return;
      }
      if (
        transferForm.fromAccountId === 0 ||
        transferForm.toAccountId === 0 ||
        transferForm.fromAccountId === transferForm.toAccountId
      ) {
        alert("Please choose two different accounts.");
        return;
      }

      await apiService.processTransfer(transferForm);
      setTransferForm({
        fromAccountId: 0,
        toAccountId: 0,
        amount: 0,
        description: "",
        category: "",
      });
      await fetchData();
      alert("Transfer processed successfully!");
      setActiveTab("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="transaction-management">
      <div className="section-header">
        <h2>Transaction Management</h2>
        <div className="tab-buttons">
          <button
            className={activeTab === "list" ? "active" : ""}
            onClick={() => setActiveTab("list")}
          >
            List
          </button>
          <button
            className={activeTab === "deposit" ? "active" : ""}
            onClick={() => setActiveTab("deposit")}
          >
            Deposit
          </button>
          <button
            className={activeTab === "withdrawal" ? "active" : ""}
            onClick={() => setActiveTab("withdrawal")}
          >
            Withdrawal
          </button>
          <button
            className={activeTab === "transfer" ? "active" : ""}
            onClick={() => setActiveTab("transfer")}
          >
            Transfer
          </button>
        </div>
      </div>

      {error && <div className="error">Error: {error}</div>}

      {activeTab === "list" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Transaction History</h3>
            <button
              onClick={async () => {
                await fetchData();
              }}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--accent-primary)",
                color: "#000000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Refresh
            </button>
          </div>
          <ResponsiveTable
            data={transactions}
            columns={[
              {
                key: "transactionDate",
                label: "Date",
                render: (value) =>
                  value ? new Date(value).toLocaleDateString() : "N/A",
              },
              {
                key: "transactionType",
                label: "Type",
                render: (value) => (
                  <span
                    className={`transaction-type ${
                      value?.toLowerCase() || "unknown"
                    }`}
                  >
                    {value || "Unknown"}
                  </span>
                ),
              },
              {
                key: "amount",
                label: "Amount",
                render: (value) => `$${(value || 0).toFixed(2)}`,
              },
              { key: "accountNumber", label: "From Account" },
              {
                key: "toAccountNumber",
                label: "To Account",
                render: (value) => value || "-",
              },
              { key: "description", label: "Description" },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span className={`status ${value?.toLowerCase() || "unknown"}`}>
                    {value || "Unknown"}
                  </span>
                ),
              },
              { key: "referenceNumber", label: "Reference" },
            ]}
          />
        </div>
      )}

      {activeTab === "deposit" && (
        <div className="transaction-form">
          <h3>Process Deposit</h3>
          <form onSubmit={handleDeposit}>
            <div className="form-group">
              <label>Account</label>
              <select
                value={depositForm.accountId}
                onChange={(e) =>
                  setDepositForm({
                    ...depositForm,
                    accountId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} ($
                    {account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={depositForm.amount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDepositForm({
                    ...depositForm,
                    amount: Number.isNaN(val) ? 0 : val,
                  });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={depositForm.description}
                onChange={(e) =>
                  setDepositForm({
                    ...depositForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter deposit description"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Process Deposit
            </button>
          </form>
        </div>
      )}

      {activeTab === "withdrawal" && (
        <div className="transaction-form">
          <h3>Process Withdrawal</h3>
          <form onSubmit={handleWithdrawal}>
            <div className="form-group">
              <label>Account</label>
              <select
                value={withdrawalForm.accountId}
                onChange={(e) =>
                  setWithdrawalForm({
                    ...withdrawalForm,
                    accountId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} ($
                    {account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={withdrawalForm.amount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setWithdrawalForm({
                    ...withdrawalForm,
                    amount: Number.isNaN(val) ? 0 : val,
                  });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={withdrawalForm.description}
                onChange={(e) =>
                  setWithdrawalForm({
                    ...withdrawalForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter withdrawal description"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Process Withdrawal
            </button>
          </form>
        </div>
      )}

      {activeTab === "transfer" && (
        <div className="transaction-form">
          <h3>Process Transfer</h3>
          <form onSubmit={handleTransfer}>
            <div className="form-group">
              <label>From Account</label>
              <select
                value={transferForm.fromAccountId}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    fromAccountId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select source account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} ($
                    {account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>To Account</label>
              <select
                value={transferForm.toAccountId}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    toAccountId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select destination account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} ($
                    {account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={transferForm.amount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTransferForm({
                    ...transferForm,
                    amount: Number.isNaN(val) ? 0 : val,
                  });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={transferForm.description}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter transfer description"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={transferForm.category}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">Select category</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Process Transfer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
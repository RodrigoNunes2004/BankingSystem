import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  availableBalance: number;
  userId: number;
  currency: string;
  isLocked: boolean;
  userName: string;
  createdAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  fullName: string;
  createdAt: string;
}

interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description: string;
  transferType: "internal" | "external";
  recipientEmail?: string;
  recipientName?: string;
}

const AccountTransfer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [, setUsers] = useState<User[]>([]);
  const [transferRequest, setTransferRequest] = useState<TransferRequest>({
    fromAccountId: 0,
    toAccountId: 0,
    amount: 0,
    description: "",
    transferType: "internal",
    recipientEmail: "",
    recipientName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user-specific accounts from API
      const userAccounts = await apiService.getAccounts();
      setAccounts(userAccounts);
      setUsers([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTransferRequest((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTransferTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const transferType = e.target.value as "internal" | "external";
    setTransferRequest((prev) => ({
      ...prev,
      transferType,
      toAccountId: transferType === "external" ? 0 : prev.toAccountId,
    }));
  };

  const getAvailableAccounts = () => {
    if (transferRequest.transferType === "internal") {
      return accounts.filter(
        (account) => account.id !== transferRequest.fromAccountId
      );
    }
    return [];
  };

  const getFromAccount = () => {
    return accounts.find(
      (account) => account.id === transferRequest.fromAccountId
    );
  };

  const getToAccount = () => {
    return accounts.find(
      (account) => account.id === transferRequest.toAccountId
    );
  };

  const validateTransfer = () => {
    if (!transferRequest.fromAccountId) {
      setError("Please select a source account");
      return false;
    }

    if (
      transferRequest.transferType === "internal" &&
      !transferRequest.toAccountId
    ) {
      setError("Please select a destination account");
      return false;
    }

    if (
      transferRequest.transferType === "external" &&
      (!transferRequest.recipientEmail || !transferRequest.recipientName)
    ) {
      setError("Please provide recipient email and name for external transfer");
      return false;
    }

    if (transferRequest.amount <= 0) {
      setError("Transfer amount must be greater than 0");
      return false;
    }

    const fromAccount = getFromAccount();
    if (fromAccount && transferRequest.amount > fromAccount.availableBalance) {
      setError("Insufficient funds in source account");
      return false;
    }

    if (!transferRequest.description.trim()) {
      setError("Please provide a transfer description");
      return false;
    }

    return true;
  };

  const processTransfer = async () => {
    if (!validateTransfer()) return;

    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        setError("Please login first!");
        return;
      }

      // Create transfer request for API
      const apiTransferRequest = {
        fromAccountId: transferRequest.fromAccountId,
        toAccountId: transferRequest.toAccountId,
        amount: transferRequest.amount,
        description: transferRequest.description,
        category: transferRequest.transferType === "internal" ? "Internal Transfer" : "External Transfer",
      };

      // Try API first, fallback to localStorage
      try {
        await apiService.processTransfer(apiTransferRequest);
      } catch (apiError) {
        console.log("API transfer failed, using localStorage fallback:", apiError);
        
        // Local fallback transfer
        const transaction = {
          id: Date.now(),
          transactionType: "TRANSFER",
          amount: transferRequest.amount,
          accountId: transferRequest.fromAccountId,
          toAccountId: transferRequest.toAccountId,
          description: transferRequest.description,
          status: "Completed",
          transactionDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          referenceNumber: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
          accountNumber: getFromAccount()?.accountNumber || "",
          toAccountNumber: getToAccount()?.accountNumber || "",
          category: transferRequest.transferType === "internal" ? "Internal Transfer" : "External Transfer",
        };

        const userTransactions = JSON.parse(
          localStorage.getItem(`banking_transactions_${currentUser.id}`) || "[]"
        );
        userTransactions.push(transaction);
        localStorage.setItem(
          `banking_transactions_${currentUser.id}`,
          JSON.stringify(userTransactions)
        );
      }

      // Update account balances in localStorage
      const userAccounts = JSON.parse(
        localStorage.getItem(`banking_accounts_${currentUser.id}`) || "[]"
      );
      const fromAccountIndex = userAccounts.findIndex(
        (a: Account) => a.id === transferRequest.fromAccountId
      );
      const toAccountIndex = userAccounts.findIndex(
        (a: Account) => a.id === transferRequest.toAccountId
      );
      
      if (fromAccountIndex !== -1) {
        userAccounts[fromAccountIndex].balance -= transferRequest.amount;
        userAccounts[fromAccountIndex].availableBalance -= transferRequest.amount;
      }
      
      if (toAccountIndex !== -1) {
        userAccounts[toAccountIndex].balance += transferRequest.amount;
        userAccounts[toAccountIndex].availableBalance += transferRequest.amount;
      }
      
      localStorage.setItem(
        `banking_accounts_${currentUser.id}`,
        JSON.stringify(userAccounts)
      );

      setSuccess(
        `Transfer of $${transferRequest.amount.toFixed(
          2
        )} completed successfully!`
      );

      // Reset form
      setTransferRequest({
        fromAccountId: 0,
        toAccountId: 0,
        amount: 0,
        description: "",
        transferType: "internal",
        recipientEmail: "",
        recipientName: "",
      });

      // Refresh data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading transfer options...</div>;
  }

  return (
    <div className="main-content">
      <h2>💸 Account Transfer</h2>

      {error && <div className="error">Error: {error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="transfer-container">
        <div className="transfer-form">
          <h3>Transfer Money</h3>

          <div className="form-group">
            <label>Transfer Type</label>
            <select
              name="transferType"
              value={transferRequest.transferType}
              onChange={handleTransferTypeChange}
              className="form-control"
            >
              <option value="internal">
                Internal Transfer (Between Your Accounts)
              </option>
              <option value="external">
                External Transfer (To Another User)
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>From Account</label>
            <select
              name="fromAccountId"
              value={transferRequest.fromAccountId}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value={0}>Select source account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.accountType} ($
                  {account.availableBalance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {transferRequest.transferType === "internal" && (
            <div className="form-group">
              <label>To Account</label>
              <select
                name="toAccountId"
                value={transferRequest.toAccountId}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value={0}>Select destination account</option>
                {getAvailableAccounts().map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} ($
                    {account.availableBalance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {transferRequest.transferType === "external" && (
            <>
              <div className="form-group">
                <label>Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={transferRequest.recipientName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter recipient's full name"
                />
              </div>

              <div className="form-group">
                <label>Recipient Email</label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={transferRequest.recipientEmail}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter recipient's email"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={transferRequest.amount}
              onChange={handleInputChange}
              className="form-control"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={transferRequest.description}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter transfer description"
              rows={3}
            />
          </div>

          <button
            onClick={processTransfer}
            disabled={isProcessing}
            className="btn btn-primary transfer-btn"
          >
            {isProcessing ? "Processing Transfer..." : "Transfer Money"}
          </button>
        </div>

        <div className="transfer-summary">
          <h3>Transfer Summary</h3>

          {transferRequest.fromAccountId && (
            <div className="summary-item">
              <strong>From:</strong>
              <div className="account-info">
                <span className="account-number">
                  {getFromAccount()?.accountNumber}
                </span>
                <span className="account-type">
                  {getFromAccount()?.accountType}
                </span>
                <span className="account-balance">
                  ${getFromAccount()?.availableBalance.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {transferRequest.transferType === "internal" &&
            transferRequest.toAccountId && (
              <div className="summary-item">
                <strong>To:</strong>
                <div className="account-info">
                  <span className="account-number">
                    {getToAccount()?.accountNumber}
                  </span>
                  <span className="account-type">
                    {getToAccount()?.accountType}
                  </span>
                  <span className="account-balance">
                    ${getToAccount()?.availableBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

          {transferRequest.transferType === "external" &&
            transferRequest.recipientName && (
              <div className="summary-item">
                <strong>To:</strong>
                <div className="recipient-info">
                  <span className="recipient-name">
                    {transferRequest.recipientName}
                  </span>
                  <span className="recipient-email">
                    {transferRequest.recipientEmail}
                  </span>
                </div>
              </div>
            )}

          {transferRequest.amount > 0 && (
            <div className="summary-item amount">
              <strong>Amount:</strong>
              <span className="transfer-amount">
                ${transferRequest.amount.toFixed(2)}
              </span>
            </div>
          )}

          {transferRequest.description && (
            <div className="summary-item">
              <strong>Description:</strong>
              <span className="transfer-description">
                {transferRequest.description}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="recent-transfers">
        <h3>Recent Transfers</h3>
        <div className="transfers-list">
          {accounts.length === 0 ? (
            <div className="no-data">
              <p>No accounts available. Please create an account first.</p>
            </div>
          ) : (
            <div className="no-data">
              <p>No recent transfers found. Complete your first transfer to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountTransfer;

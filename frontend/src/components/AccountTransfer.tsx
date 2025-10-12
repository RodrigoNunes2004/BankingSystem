import React, { useState, useEffect } from "react";

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
      // Use mock data for now since API is having issues
      const mockAccounts: Account[] = [
        {
          id: 1,
          accountNumber: "7559546839",
          accountType: "Checking",
          balance: 8200.0,
          availableBalance: 8200.0,
          userId: 1,
          currency: "USD",
          isLocked: false,
          userName: "John Doe",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          accountNumber: "6275708843",
          accountType: "Savings",
          balance: 1600.0,
          availableBalance: 1600.0,
          userId: 1,
          currency: "USD",
          isLocked: false,
          userName: "John Doe",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 3,
          accountNumber: "1234567890",
          accountType: "Checking",
          balance: 5000.0,
          availableBalance: 5000.0,
          userId: 2,
          currency: "USD",
          isLocked: false,
          userName: "Jane Smith",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 4,
          accountNumber: "0987654321",
          accountType: "Savings",
          balance: 12000.0,
          availableBalance: 12000.0,
          userId: 2,
          currency: "USD",
          isLocked: false,
          userName: "Jane Smith",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const mockUsers: User[] = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "+1234567890",
          dateOfBirth: "1990-01-15",
          address: "123 Main St",
          city: "New York",
          postalCode: "10001",
          country: "USA",
          fullName: "John Doe",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phoneNumber: "+1234567891",
          dateOfBirth: "1985-05-20",
          address: "456 Oak Ave",
          city: "Los Angeles",
          postalCode: "90210",
          country: "USA",
          fullName: "Jane Smith",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      setAccounts(mockAccounts);
      setUsers(mockUsers);
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

      // Simulate transfer processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update account balances (mock)
      const fromAccount = getFromAccount();
      const toAccount = getToAccount();

      if (fromAccount) {
        fromAccount.balance -= transferRequest.amount;
        fromAccount.availableBalance -= transferRequest.amount;
      }

      if (toAccount) {
        toAccount.balance += transferRequest.amount;
        toAccount.availableBalance += transferRequest.amount;
      }

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
          <div className="transfer-item">
            <div className="transfer-icon">💸</div>
            <div className="transfer-details">
              <div className="transfer-amount">$500.00</div>
              <div className="transfer-description">Transfer to Savings</div>
              <div className="transfer-date">Dec 10, 2024</div>
            </div>
            <div className="transfer-status completed">Completed</div>
          </div>

          <div className="transfer-item">
            <div className="transfer-icon">💸</div>
            <div className="transfer-details">
              <div className="transfer-amount">$200.00</div>
              <div className="transfer-description">Payment to Jane Smith</div>
              <div className="transfer-date">Dec 9, 2024</div>
            </div>
            <div className="transfer-status completed">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTransfer;

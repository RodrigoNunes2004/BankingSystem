import React, { useState, useEffect } from "react";
import {
  apiService,
  Account,
  User,
  CreateAccountRequest,
} from "../services/api";

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [formData, setFormData] = useState<CreateAccountRequest>({
    accountType: "",
    userId: 0,
    currency: "USD",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsData, usersData] = await Promise.all([
        apiService.getAccounts(),
        apiService.getUsers(),
      ]);
      setAccounts(accountsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await apiService.updateAccount(editingAccount.id, formData);
      } else {
        await apiService.createAccount(formData);
      }
      setShowCreateForm(false);
      setEditingAccount(null);
      setFormData({
        accountType: "",
        userId: 0,
        currency: "USD",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      accountType: account.accountType,
      userId: account.userId,
      currency: account.currency,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await apiService.deleteAccount(id);
        fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading accounts...</div>;
  }

  return (
    <div className="account-management">
      <div className="section-header">
        <h2>Account Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Add New Account
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingAccount ? "Edit Account" : "Create New Account"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>User</label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userId: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value={0}>Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  required
                >
                  <option value="">Select account type</option>
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="NZD">NZD</option>
                  <option value="AUD">AUD</option>
                  <option value="BRL">BRL</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingAccount ? "Update Account" : "Create Account"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingAccount(null);
                    setFormData({
                      accountType: "",
                      userId: 0,
                      currency: "USD",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Account Type</th>
              <th>User</th>
              <th>Balance</th>
              <th>Available Balance</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.accountNumber}</td>
                <td>{account.accountType}</td>
                <td>{account.userName}</td>
                <td>${account.balance.toFixed(2)}</td>
                <td>${account.availableBalance.toFixed(2)}</td>
                <td>{account.currency}</td>
                <td>
                  <span
                    className={`status ${
                      account.isLocked ? "locked" : "active"
                    }`}
                  >
                    {account.isLocked ? "Locked" : "Active"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(account)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(account.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;

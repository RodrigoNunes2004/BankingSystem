import React, { useState, useEffect } from "react";
import { apiService, User, Account, Transaction } from "../services/api";

interface SystemStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalBalance: number;
  activeUsers: number;
  lockedAccounts: number;
  pendingTransactions: number;
  systemUptime: string;
}

interface AdminUser extends User {
  lastLogin?: string;
  isActive: boolean;
  loginAttempts: number;
  accountCount: number;
}

interface AdminAccount extends Account {
  userEmail: string;
  userName: string;
  transactionCount: number;
  lastActivity: string;
}

interface AdminTransaction extends Transaction {
  userEmail: string;
  userName: string;
  accountNumber: string;
  toAccountNumber?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0,
    activeUsers: 0,
    lockedAccounts: 0,
    pendingTransactions: 0,
    systemUptime: "99.9%"
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed unused state variables to fix ESLint warnings

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load system statistics
      const [usersData, accountsData, transactionsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getAccounts(),
        apiService.getTransactionsByDateRange(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        )
      ]);

      // Calculate system stats
      const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);
      const activeUsers = usersData.length; // All users are considered active for now
      const lockedAccounts = accountsData.filter(a => a.isLocked).length;
      const pendingTransactions = transactionsData.filter((t: any) => t.status === "Pending").length;

      setSystemStats({
        totalUsers: usersData.length,
        totalAccounts: accountsData.length,
        totalTransactions: transactionsData.length,
        totalBalance,
        activeUsers,
        lockedAccounts,
        pendingTransactions,
        systemUptime: "99.9%"
      });

      // Enhance data with admin-specific information
      const adminUsers: AdminUser[] = usersData.map(user => ({
        ...user,
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: Math.random() > 0.1,
        loginAttempts: Math.floor(Math.random() * 5),
        accountCount: accountsData.filter(acc => acc.userId === user.id).length
      }));

      const adminAccounts: AdminAccount[] = accountsData.map(account => {
        const user = usersData.find(u => u.id === account.userId);
        const userTransactions = transactionsData.filter((t: any) => t.accountId === account.id);
        return {
          ...account,
          userEmail: user?.email || "",
          userName: user?.firstName + " " + user?.lastName || "",
          transactionCount: userTransactions.length,
          lastActivity: userTransactions.length > 0 
            ? userTransactions[0].transactionDate 
            : account.createdAt
        };
      });

      const adminTransactions: AdminTransaction[] = transactionsData.map((transaction: any) => {
        const account = accountsData.find(a => a.id === transaction.accountId);
        const user = usersData.find(u => u.id === account?.userId);
        const toAccount = transaction.toAccountId 
          ? accountsData.find(a => a.id === transaction.toAccountId)
          : null;
        
        return {
          ...transaction,
          userEmail: user?.email || "",
          userName: user?.firstName + " " + user?.lastName || "",
          accountNumber: account?.accountNumber || "",
          toAccountNumber: toAccount?.accountNumber
        };
      });

      setUsers(adminUsers);
      setAccounts(adminAccounts);
      setTransactions(adminTransactions);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: string) => {
    try {
      if (action === "lock") {
        // Lock user logic
        console.log("Locking user:", userId);
      } else if (action === "unlock") {
        // Unlock user logic
        console.log("Unlocking user:", userId);
      } else if (action === "reset") {
        // Reset password logic
        console.log("Resetting password for user:", userId);
      }
      await loadAdminData();
    } catch (error) {
      console.error("Error performing user action:", error);
    }
  };

  const handleAccountAction = async (accountId: number, action: string) => {
    try {
      if (action === "lock") {
        // Lock account logic
        console.log("Locking account:", accountId);
      } else if (action === "unlock") {
        // Unlock account logic
        console.log("Unlocking account:", accountId);
      } else if (action === "freeze") {
        // Freeze account logic
        console.log("Freezing account:", accountId);
      }
      await loadAdminData();
    } catch (error) {
      console.error("Error performing account action:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="main-content">
      <div className="admin-header">
        <h1>🔧 Admin Panel</h1>
        <p>System Administration & Management</p>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button
          className={`admin-tab ${activeTab === "accounts" ? "active" : ""}`}
          onClick={() => setActiveTab("accounts")}
        >
          🏦 Accounts
        </button>
        <button
          className={`admin-tab ${activeTab === "transactions" ? "active" : ""}`}
          onClick={() => setActiveTab("transactions")}
        >
          💳 Transactions
        </button>
        <button
          className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="admin-dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{systemStats.totalUsers}</h3>
                <p>Total Users</p>
                <span className="stat-subtitle">{systemStats.activeUsers} active</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏦</div>
              <div className="stat-content">
                <h3>{systemStats.totalAccounts}</h3>
                <p>Total Accounts</p>
                <span className="stat-subtitle">{systemStats.lockedAccounts} locked</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💳</div>
              <div className="stat-content">
                <h3>{systemStats.totalTransactions}</h3>
                <p>Total Transactions</p>
                <span className="stat-subtitle">{systemStats.pendingTransactions} pending</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>{formatCurrency(systemStats.totalBalance)}</h3>
                <p>Total Balance</p>
                <span className="stat-subtitle">System wide</span>
              </div>
            </div>
          </div>

          <div className="admin-charts">
            <div className="chart-card">
              <h3>System Health</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span className="health-label">Uptime</span>
                  <span className="health-value success">{systemStats.systemUptime}</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Active Users</span>
                  <span className="health-value info">{systemStats.activeUsers}</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Locked Accounts</span>
                  <span className="health-value warning">{systemStats.lockedAccounts}</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Pending Transactions</span>
                  <span className="health-value warning">{systemStats.pendingTransactions}</span>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="activity-item">
                    <div className="activity-icon">
                      {transaction.transactionType === "Deposit" ? "📈" : 
                       transaction.transactionType === "Withdrawal" ? "📉" : "🔄"}
                    </div>
                    <div className="activity-content">
                      <p>{transaction.userName} - {transaction.transactionType}</p>
                      <span>{formatCurrency(transaction.amount)} • {formatDate(transaction.transactionDate)}</span>
                    </div>
                    <div className={`activity-status ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="admin-users">
          <div className="admin-section-header">
            <h2>User Management</h2>
            <button className="btn btn-primary">Add User</button>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Accounts</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <strong>{user.firstName} {user.lastName}</strong>
                          <br />
                          <small>ID: {user.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.accountCount}</td>
                    <td>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleUserAction(user.id, user.isActive ? "lock" : "unlock")}
                        >
                          {user.isActive ? "🔒 Lock" : "🔓 Unlock"}
                        </button>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleUserAction(user.id, "reset")}
                        >
                          🔑 Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === "accounts" && (
        <div className="admin-accounts">
          <div className="admin-section-header">
            <h2>Account Management</h2>
            <button className="btn btn-primary">Create Account</button>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Owner</th>
                  <th>Balance</th>
                  <th>Type</th>
                  <th>Transactions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <div className="account-info">
                        <strong>{account.accountNumber}</strong>
                        <br />
                        <small>ID: {account.id}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{account.userName}</strong>
                        <br />
                        <small>{account.userEmail}</small>
                      </div>
                    </td>
                    <td>
                      <strong>{formatCurrency(account.balance)}</strong>
                      <br />
                      <small>Available: {formatCurrency(account.availableBalance)}</small>
                    </td>
                    <td>{account.accountType}</td>
                    <td>{account.transactionCount}</td>
                    <td>
                      <span className={`status-badge ${account.isLocked ? "inactive" : "active"}`}>
                        {account.isLocked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleAccountAction(account.id, account.isLocked ? "unlock" : "lock")}
                        >
                          {account.isLocked ? "🔓 Unlock" : "🔒 Lock"}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAccountAction(account.id, "freeze")}
                        >
                          ❄️ Freeze
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="admin-transactions">
          <div className="admin-section-header">
            <h2>Transaction Monitoring</h2>
            <div className="filter-controls">
              <select className="form-control">
                <option>All Status</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Failed</option>
              </select>
              <select className="form-control">
                <option>All Types</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
                <option>Transfer</option>
              </select>
            </div>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="transaction-info">
                        <strong>#{transaction.referenceNumber}</strong>
                        <br />
                        <small>{transaction.description}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{transaction.userName}</strong>
                        <br />
                        <small>{transaction.accountNumber}</small>
                      </div>
                    </td>
                    <td>
                      <strong>{formatCurrency(transaction.amount)}</strong>
                      {transaction.toAccountNumber && (
                        <>
                          <br />
                          <small>→ {transaction.toAccountNumber}</small>
                        </>
                      )}
                    </td>
                    <td>{transaction.transactionType}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{formatDate(transaction.transactionDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-info">👁️ View</button>
                        <button className="btn btn-sm btn-warning">⏸️ Hold</button>
                        <button className="btn btn-sm btn-danger">❌ Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="admin-settings">
          <div className="admin-section-header">
            <h2>System Settings</h2>
          </div>
          
          <div className="settings-grid">
            <div className="settings-card">
              <h3>Security Settings</h3>
              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input type="number" className="form-control" defaultValue="30" />
              </div>
              <div className="setting-item">
                <label>Max Login Attempts</label>
                <input type="number" className="form-control" defaultValue="5" />
              </div>
              <div className="setting-item">
                <label>Password Policy</label>
                <select className="form-control">
                  <option>Strong</option>
                  <option>Medium</option>
                  <option>Basic</option>
                </select>
              </div>
            </div>

            <div className="settings-card">
              <h3>Transaction Limits</h3>
              <div className="setting-item">
                <label>Daily Transfer Limit</label>
                <input type="number" className="form-control" defaultValue="10000" />
              </div>
              <div className="setting-item">
                <label>Max Transaction Amount</label>
                <input type="number" className="form-control" defaultValue="50000" />
              </div>
              <div className="setting-item">
                <label>Auto-approve Limit</label>
                <input type="number" className="form-control" defaultValue="1000" />
              </div>
            </div>

            <div className="settings-card">
              <h3>System Maintenance</h3>
              <div className="setting-item">
                <label>Database Backup</label>
                <button className="btn btn-primary">Backup Now</button>
              </div>
              <div className="setting-item">
                <label>Clear Cache</label>
                <button className="btn btn-warning">Clear Cache</button>
              </div>
              <div className="setting-item">
                <label>System Restart</label>
                <button className="btn btn-danger">Restart System</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

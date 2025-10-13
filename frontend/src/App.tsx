import React, { useState } from "react";
import "./App.css";
// Banking System - Clean Professional Version with Authentication - 2024-01-15-19:00
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import AccountManagement from "./components/AccountManagement";
import TransactionManagement from "./components/TransactionManagement";
import CurrencyExchange from "./components/CurrencyExchange";
import CardManagement from "./components/CardManagement";
import InsuranceManagement from "./components/InsuranceManagement";
import AccountTransfer from "./components/AccountTransfer";
import AdminPanel from "./components/AdminPanel";
import LoanManagement from "./components/LoanManagement";
import MobileMenu from "./components/MobileMenu";
import ThemeToggle from "./components/ThemeToggle";
import AuthApp from "./components/AuthApp";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Banking App Component - handles authentication and main app logic
const BankingApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "accounts":
        return <AccountManagement />;
      case "transactions":
        return <TransactionManagement />;
      case "currency":
        return <CurrencyExchange />;
      case "cards":
        return <CardManagement />;
      case "insurance":
        return <InsuranceManagement />;
      case "transfer":
        return <AccountTransfer />;
      case "admin":
        return <AdminPanel />;
      case "loans":
        return <LoanManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1>🏦 Banking System</h1>
            <div className="header-actions">
              <div className="user-info">
                <span className="user-name">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="btn btn-secondary logout-btn"
                >
                  Logout
                </button>
              </div>
              <ThemeToggle />
              <MobileMenu activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
          <nav className="nav-tabs">
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              👥 Users
            </button>
            <button
              className={activeTab === "accounts" ? "active" : ""}
              onClick={() => setActiveTab("accounts")}
            >
              🏦 Accounts
            </button>
            <button
              className={activeTab === "transactions" ? "active" : ""}
              onClick={() => setActiveTab("transactions")}
            >
              💳 Transactions
            </button>
            <button
              className={activeTab === "currency" ? "active" : ""}
              onClick={() => setActiveTab("currency")}
            >
              💱 Currency Exchange
            </button>
            <button
              className={activeTab === "cards" ? "active" : ""}
              onClick={() => setActiveTab("cards")}
            >
              💳 Cards
            </button>
            <button
              className={activeTab === "insurance" ? "active" : ""}
              onClick={() => setActiveTab("insurance")}
            >
              🛡️ Insurance
            </button>
            <button
              className={activeTab === "transfer" ? "active" : ""}
              onClick={() => setActiveTab("transfer")}
            >
              💸 Transfer
            </button>
            <button
              className={activeTab === "admin" ? "active" : ""}
              onClick={() => setActiveTab("admin")}
            >
              🔧 Admin
            </button>
            <button
              className={activeTab === "loans" ? "active" : ""}
              onClick={() => setActiveTab("loans")}
            >
              💰 Loans
            </button>
          </nav>
        </header>
        <main className="app-main">{renderContent()}</main>
      </div>
    </ThemeProvider>
  );
};

// Main App Component with Authentication
function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

// Component that handles authentication state
const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="App">
          <div className="loading-container">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <div className="App">
          <AuthApp />
        </div>
      </ThemeProvider>
    );
  }

  return <BankingApp />;
};

export default App;

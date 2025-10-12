import React, { useState } from "react";
import "./App.css";
// Banking System - Clean Professional Version - 2024-01-15-18:00
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import AccountManagement from "./components/AccountManagement";
import TransactionManagement from "./components/TransactionManagement";
import CurrencyExchange from "./components/CurrencyExchange";
import CardManagement from "./components/CardManagement";
import InsuranceManagement from "./components/InsuranceManagement";
import AccountTransfer from "./components/AccountTransfer";
import MobileMenu from "./components/MobileMenu";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          </nav>
        </header>
        <main className="app-main">{renderContent()}</main>
      </div>
    </ThemeProvider>
  );
}

export default App;

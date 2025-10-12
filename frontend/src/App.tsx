import React, { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import AccountManagement from "./components/AccountManagement";
import TransactionManagement from "./components/TransactionManagement";
import CurrencyExchange from "./components/CurrencyExchange";
import CardManagement from "./components/CardManagement";
import InsuranceManagement from "./components/InsuranceManagement";
import MobileMenu from "./components/MobileMenu";

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Banking System</h1>
        <MobileMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <nav className="nav-tabs">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "accounts" ? "active" : ""}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </button>
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
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
        </nav>
      </header>
      <main className="app-main">{renderContent()}</main>
    </div>
  );
}

export default App;

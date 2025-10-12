import React, { useState } from "react";

interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "accounts", label: "Accounts", icon: "🏦" },
    { id: "transactions", label: "Transactions", icon: "💳" },
    { id: "currency", label: "Currency Exchange", icon: "💱" },
    { id: "cards", label: "Cards", icon: "💳" },
    { id: "insurance", label: "Insurance", icon: "🛡️" },
    { id: "transfer", label: "Transfer", icon: "💸" },
  ];

  return (
    <div className="mobile-menu">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <h2>Banking System</h2>
              <button
                className="mobile-menu-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="mobile-menu-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`mobile-menu-item ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="mobile-menu-icon">{tab.icon}</span>
                  <span className="mobile-menu-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

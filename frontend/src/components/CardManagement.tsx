import React, { useState, useEffect, useCallback } from "react";
import { apiService, Account } from "../services/api";

interface Card {
  id: number;
  cardNumber: string;
  cardType: "credit" | "debit";
  cardBrand: "visa" | "mastercard" | "amex";
  expiryDate: string;
  cvv: string;
  accountId: number;
  accountNumber: string;
  isActive: boolean;
  creditLimit?: number;
  availableCredit?: number;
  currentBalance?: number;
  lastUsed?: string;
}

interface CreateCardRequest {
  cardType: "credit" | "debit";
  cardBrand: "visa" | "mastercard" | "amex";
  accountId: number;
  creditLimit?: number;
}

// Mock data moved outside component to prevent recreation on every render
// NO DEFAULT VALUES - each user starts with empty card list
const mockCards: Card[] = [];

const CardManagement: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"view" | "add" | "settings">(
    "view"
  );

  // Add card form state
  const [newCard, setNewCard] = useState<CreateCardRequest>({
    cardType: "debit",
    cardBrand: "visa",
    accountId: 0,
    creditLimit: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings modal states
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showMobilePayModal, setShowMobilePayModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSpendingLimitsModal, setShowSpendingLimitsModal] = useState(false);

  // Settings form states
  const [securitySettings, setSecuritySettings] = useState({
    threeDSecure: true,
    transactionNotifications: true,
    internationalTransactions: "enabled",
    onlineTransactions: "enabled",
  });

  const [mobilePaySettings, setMobilePaySettings] = useState({
    applePay: false,
    googlePay: false,
    samsungPay: false,
    contactlessPayments: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    transactionAlerts: true,
    largeTransactionAlerts: true,
    internationalTransactionAlerts: true,
    cardUsageAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [spendingLimits, setSpendingLimits] = useState({
    dailyLimit: "",
    monthlyLimit: "",
    internationalLimit: "",
    atmLimit: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Get current user
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        setError("Please login first!");
        return;
      }

      // Load user's actual accounts from localStorage
      const userAccounts = JSON.parse(
        localStorage.getItem(`banking_accounts_${currentUser.id}`) || "[]"
      );
      setAccounts(userAccounts);

      // Load user's cards from localStorage
      const userCards = JSON.parse(
        localStorage.getItem(`banking_cards_${currentUser.id}`) || "[]"
      );
      setCards(userCards);

      // Load user's card settings from localStorage
      const userSecuritySettings = JSON.parse(
        localStorage.getItem(`banking_card_security_${currentUser.id}`) ||
          JSON.stringify(securitySettings)
      );
      setSecuritySettings(userSecuritySettings);

      const userMobilePaySettings = JSON.parse(
        localStorage.getItem(`banking_mobile_pay_${currentUser.id}`) ||
          JSON.stringify(mobilePaySettings)
      );
      setMobilePaySettings(userMobilePaySettings);

      const userNotificationSettings = JSON.parse(
        localStorage.getItem(`banking_notifications_${currentUser.id}`) ||
          JSON.stringify(notificationSettings)
      );
      setNotificationSettings(userNotificationSettings);

      const userSpendingLimits = JSON.parse(
        localStorage.getItem(`banking_spending_limits_${currentUser.id}`) ||
          JSON.stringify(spendingLimits)
      );
      setSpendingLimits(userSpendingLimits);

      console.log("✅ CARD MANAGEMENT - Loaded user accounts:", userAccounts);
      console.log("✅ CARD MANAGEMENT - Loaded user cards:", userCards);
      console.log("✅ CARD MANAGEMENT - Loaded settings:", {
        userSecuritySettings,
        userMobilePaySettings,
        userNotificationSettings,
        userSpendingLimits,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateCardNumber = (brand: string): string => {
    const prefixes = {
      visa: ["4532", "4556", "4716"],
      mastercard: ["5555", "2223", "5100"],
      amex: ["3782", "3714"],
    };

    const prefix =
      prefixes[brand as keyof typeof prefixes][
        Math.floor(
          Math.random() * prefixes[brand as keyof typeof prefixes].length
        )
      ];
    const middle = "****-****";
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();

    return `${prefix}-${middle}-${last4}`;
  };

  const generateExpiryDate = (): string => {
    const currentYear = new Date().getFullYear();
    const year = currentYear + Math.floor(Math.random() * 5) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  const handleAddCard = async () => {
    if (!newCard.accountId) {
      setError("Please select an account");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAccount = accounts.find(
        (acc) => acc.id === newCard.accountId
      );
      if (!selectedAccount) {
        setError("Selected account not found");
        return;
      }

      const cardNumber = generateCardNumber(newCard.cardBrand);
      const expiryDate = generateExpiryDate();
      const cvv = Math.floor(100 + Math.random() * 900).toString();

      const newCardData: Card = {
        id: Date.now(),
        cardNumber,
        cardType: newCard.cardType,
        cardBrand: newCard.cardBrand,
        expiryDate,
        cvv,
        accountId: newCard.accountId,
        accountNumber: selectedAccount.accountNumber,
        isActive: true,
        creditLimit:
          newCard.cardType === "credit" ? newCard.creditLimit : undefined,
        availableCredit:
          newCard.cardType === "credit" ? newCard.creditLimit : undefined,
        currentBalance: newCard.cardType === "credit" ? 0 : undefined,
        lastUsed: undefined,
      };

      // Get current user
      const currentUser = JSON.parse(
        localStorage.getItem("banking_user") || "null"
      );
      if (!currentUser) {
        setError("Please login first!");
        return;
      }

      // Save card to localStorage
      const userCards = JSON.parse(
        localStorage.getItem(`banking_cards_${currentUser.id}`) || "[]"
      );
      userCards.push(newCardData);
      localStorage.setItem(
        `banking_cards_${currentUser.id}`,
        JSON.stringify(userCards)
      );

      // Update local state
      setCards([...cards, newCardData]);

      console.log("✅ CARD CREATED AND SAVED:", newCardData);
      console.log("✅ ALL USER CARDS:", userCards);

      // Reset form
      setNewCard({
        cardType: "debit",
        cardBrand: "visa",
        accountId: 0,
        creditLimit: 0,
      });

      setActiveTab("view");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCardStatus = (cardId: number) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, isActive: !card.isActive } : card
      )
    );
  };

  const handleSpendingLimitUpdate = async (
    cardId: number,
    newLimit: number
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCards(
        cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                creditLimit: newLimit,
                availableCredit: newLimit - (card.currentBalance || 0),
              }
            : card
        )
      );
      alert("Spending limit updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update spending limit"
      );
    }
  };

  const handleCardReplacement = async (cardId: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const card = cards.find((c) => c.id === cardId);
      if (card) {
        const newCardNumber = generateCardNumber(card.cardBrand);
        setCards(
          cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  cardNumber: newCardNumber,
                  lastUsed: new Date().toISOString(),
                }
              : c
          )
        );
        alert(
          "Card replacement requested! New card will arrive in 5-7 business days."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to request card replacement"
      );
    }
  };

  const handleCardBlock = async (cardId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCards(
        cards.map((card) =>
          card.id === cardId ? { ...card, isActive: false } : card
        )
      );
      alert("Card blocked successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to block card");
    }
  };

  // Settings save functions
  const saveSecuritySettings = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("banking_user") || "null"
    );
    if (!currentUser) return;

    localStorage.setItem(
      `banking_card_security_${currentUser.id}`,
      JSON.stringify(securitySettings)
    );
    console.log("✅ Security settings saved:", securitySettings);
    alert("Security settings updated successfully!");
    setShowSecurityModal(false);
  };

  const saveMobilePaySettings = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("banking_user") || "null"
    );
    if (!currentUser) return;

    localStorage.setItem(
      `banking_mobile_pay_${currentUser.id}`,
      JSON.stringify(mobilePaySettings)
    );
    console.log("✅ Mobile pay settings saved:", mobilePaySettings);
    alert("Mobile payment settings updated successfully!");
    setShowMobilePayModal(false);
  };

  const saveNotificationSettings = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("banking_user") || "null"
    );
    if (!currentUser) return;

    localStorage.setItem(
      `banking_notifications_${currentUser.id}`,
      JSON.stringify(notificationSettings)
    );
    console.log("✅ Notification settings saved:", notificationSettings);
    alert("Notification settings updated successfully!");
    setShowNotificationsModal(false);
  };

  const saveSpendingLimits = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("banking_user") || "null"
    );
    if (!currentUser) return;

    localStorage.setItem(
      `banking_spending_limits_${currentUser.id}`,
      JSON.stringify(spendingLimits)
    );
    console.log("✅ Spending limits saved:", spendingLimits);
    alert("Spending limits updated successfully!");
    setShowSpendingLimitsModal(false);
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "credit":
        return "#ffd700";
      case "debit":
        return "#ffd700";
      default:
        return "#6c757d";
    }
  };

  if (loading) return <div className="loading">Loading cards...</div>;

  return (
    <div className="main-content">
      <h2>💳 Card Management</h2>

      {error && <div className="error">Error: {error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
          data-icon="👁️"
        >
          <span>View Cards</span>
        </button>
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
          data-icon="➕"
        >
          <span>Add Card</span>
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
          data-icon="⚙️"
        >
          <span>Settings</span>
        </button>
      </div>

      {activeTab === "view" && (
        <div className="cards-container">
          <h3>Your Cards</h3>
          {cards.length === 0 ? (
            <div className="no-cards">
              <p>No cards found. Add your first card to get started!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card-item ${!card.isActive ? "inactive" : ""}`}
                >
                  <div className="card-header">
                    <div className="card-brand">
                      <span className="card-icon">
                        {getCardBrandIcon(card.cardBrand)}
                      </span>
                      <span
                        className="card-type"
                        style={{ color: getCardTypeColor(card.cardType) }}
                      >
                        {card.cardType.toUpperCase()}
                      </span>
                    </div>
                    <div className="card-status">
                      <span
                        className={`status-badge ${
                          card.isActive ? "active" : "inactive"
                        }`}
                      >
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="card-number">{card.cardNumber}</div>

                  <div className="card-details">
                    <div className="card-expiry">
                      <span className="label">Expires:</span>
                      <span className="value">{card.expiryDate}</span>
                    </div>
                    <div className="card-account">
                      <span className="label">Account:</span>
                      <span className="value">{card.accountNumber}</span>
                    </div>
                  </div>

                  {card.cardType === "credit" && (
                    <div className="credit-info">
                      <div className="credit-limit">
                        <span className="label">Credit Limit:</span>
                        <span className="value">
                          ${card.creditLimit?.toLocaleString()}
                        </span>
                      </div>
                      <div className="available-credit">
                        <span className="label">Available:</span>
                        <span className="value">
                          ${card.availableCredit?.toLocaleString()}
                        </span>
                      </div>
                      <div className="current-balance">
                        <span className="label">Balance:</span>
                        <span className="value">
                          ${card.currentBalance?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {card.lastUsed && (
                    <div className="card-last-used">
                      <span className="label">Last Used:</span>
                      <span className="value">
                        {new Date(card.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="card-actions">
                    <button
                      className={`btn ${
                        card.isActive ? "btn-warning" : "btn-success"
                      }`}
                      onClick={() => toggleCardStatus(card.id)}
                    >
                      {card.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCardBlock(card.id)}
                    >
                      Block
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCardReplacement(card.id)}
                    >
                      🔄 Replace
                    </button>
                    {card.cardType === "credit" && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          const newLimit = prompt(
                            "Enter new spending limit:",
                            card.creditLimit?.toString() || "0"
                          );
                          if (newLimit && !isNaN(Number(newLimit))) {
                            handleSpendingLimitUpdate(
                              card.id,
                              Number(newLimit)
                            );
                          }
                        }}
                      >
                        💰 Limit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="add-card-form">
          <h3>Add New Card</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Card Type</label>
              <select
                value={newCard.cardType}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    cardType: e.target.value as "credit" | "debit",
                  })
                }
                required
              >
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>Card Brand</label>
              <select
                value={newCard.cardBrand}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    cardBrand: e.target.value as "visa" | "mastercard" | "amex",
                  })
                }
                required
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Link to Account</label>
            <select
              value={newCard.accountId}
              onChange={(e) =>
                setNewCard({ ...newCard, accountId: parseInt(e.target.value) })
              }
              required
            >
              <option value={0}>Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.currency} ($
                  {account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {newCard.cardType === "credit" && (
            <div className="form-group">
              <label>Credit Limit</label>
              <input
                type="number"
                value={newCard.creditLimit || ""}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    creditLimit: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter credit limit"
                min="100"
                max="50000"
                required
              />
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleAddCard}
            disabled={isSubmitting || !newCard.accountId}
          >
            {isSubmitting ? "Adding Card..." : "Add Card"}
          </button>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="card-settings">
          <h3>Card Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <h4>🔒 Security Settings</h4>
              <p>Manage your card security preferences</p>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSecurityModal(true)}
              >
                Configure
              </button>
            </div>
            <div className="setting-item">
              <h4>📱 Mobile Payments</h4>
              <p>Set up Apple Pay, Google Pay, etc.</p>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMobilePayModal(true)}
              >
                Setup
              </button>
            </div>
            <div className="setting-item">
              <h4>🔔 Notifications</h4>
              <p>Configure transaction alerts</p>
              <button
                className="btn btn-secondary"
                onClick={() => setShowNotificationsModal(true)}
              >
                Configure
              </button>
            </div>
            <div className="setting-item">
              <h4>📊 Spending Limits</h4>
              <p>Set daily/monthly spending limits</p>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSpendingLimitsModal(true)}
              >
                Set Limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔒 Security Settings</h3>
              <button
                className="modal-close"
                onClick={() => setShowSecurityModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Enable 3D Secure</label>
                <input
                  type="checkbox"
                  checked={securitySettings.threeDSecure}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      threeDSecure: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Transaction Notifications</label>
                <input
                  type="checkbox"
                  checked={securitySettings.transactionNotifications}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      transactionNotifications: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>International Transactions</label>
                <select
                  value={securitySettings.internationalTransactions}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      internationalTransactions: e.target.value,
                    })
                  }
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Online Transactions</label>
                <select
                  value={securitySettings.onlineTransactions}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      onlineTransactions: e.target.value,
                    })
                  }
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSecurityModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveSecuritySettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Payments Modal */}
      {showMobilePayModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📱 Mobile Payments Setup</h3>
              <button
                className="modal-close"
                onClick={() => setShowMobilePayModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Apple Pay</label>
                <input
                  type="checkbox"
                  checked={mobilePaySettings.applePay}
                  onChange={(e) =>
                    setMobilePaySettings({
                      ...mobilePaySettings,
                      applePay: e.target.checked,
                    })
                  }
                />
                <span style={{ marginLeft: "10px" }}>Enable Apple Pay</span>
              </div>
              <div className="form-group">
                <label>Google Pay</label>
                <input
                  type="checkbox"
                  checked={mobilePaySettings.googlePay}
                  onChange={(e) =>
                    setMobilePaySettings({
                      ...mobilePaySettings,
                      googlePay: e.target.checked,
                    })
                  }
                />
                <span style={{ marginLeft: "10px" }}>Enable Google Pay</span>
              </div>
              <div className="form-group">
                <label>Samsung Pay</label>
                <input
                  type="checkbox"
                  checked={mobilePaySettings.samsungPay}
                  onChange={(e) =>
                    setMobilePaySettings({
                      ...mobilePaySettings,
                      samsungPay: e.target.checked,
                    })
                  }
                />
                <span style={{ marginLeft: "10px" }}>Enable Samsung Pay</span>
              </div>
              <div className="form-group">
                <label>Contactless Payments</label>
                <input
                  type="checkbox"
                  checked={mobilePaySettings.contactlessPayments}
                  onChange={(e) =>
                    setMobilePaySettings({
                      ...mobilePaySettings,
                      contactlessPayments: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowMobilePayModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveMobilePaySettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔔 Notification Settings</h3>
              <button
                className="modal-close"
                onClick={() => setShowNotificationsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Transaction Alerts</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.transactionAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      transactionAlerts: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Large Transaction Alerts (&gt;$100)</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.largeTransactionAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      largeTransactionAlerts: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>International Transaction Alerts</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.internationalTransactionAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      internationalTransactionAlerts: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Card Usage Alerts</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.cardUsageAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      cardUsageAlerts: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email Notifications</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>SMS Notifications</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNotificationsModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveNotificationSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spending Limits Modal */}
      {showSpendingLimitsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📊 Spending Limits</h3>
              <button
                className="modal-close"
                onClick={() => setShowSpendingLimitsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Daily Spending Limit</label>
                <input
                  type="number"
                  placeholder="Enter daily limit"
                  value={spendingLimits.dailyLimit}
                  onChange={(e) =>
                    setSpendingLimits({
                      ...spendingLimits,
                      dailyLimit: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Monthly Spending Limit</label>
                <input
                  type="number"
                  placeholder="Enter monthly limit"
                  value={spendingLimits.monthlyLimit}
                  onChange={(e) =>
                    setSpendingLimits({
                      ...spendingLimits,
                      monthlyLimit: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>International Spending Limit</label>
                <input
                  type="number"
                  placeholder="Enter international limit"
                  value={spendingLimits.internationalLimit}
                  onChange={(e) =>
                    setSpendingLimits({
                      ...spendingLimits,
                      internationalLimit: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>ATM Withdrawal Limit</label>
                <input
                  type="number"
                  placeholder="Enter ATM limit"
                  value={spendingLimits.atmLimit}
                  onChange={(e) =>
                    setSpendingLimits({
                      ...spendingLimits,
                      atmLimit: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSpendingLimitsModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveSpendingLimits}>
                Save Limits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManagement;

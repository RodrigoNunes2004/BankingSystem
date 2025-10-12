import React, { useState, useEffect } from "react";
import { apiService, Account } from "../services/api";

interface Card {
  id: number;
  cardNumber: string;
  cardType: 'credit' | 'debit';
  cardBrand: 'visa' | 'mastercard' | 'amex';
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
  cardType: 'credit' | 'debit';
  cardBrand: 'visa' | 'mastercard' | 'amex';
  accountId: number;
  creditLimit?: number;
}

const CardManagement: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'settings'>('view');
  
  // Add card form state
  const [newCard, setNewCard] = useState<CreateCardRequest>({
    cardType: 'debit',
    cardBrand: 'visa',
    accountId: 0,
    creditLimit: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  const mockCards: Card[] = [
    {
      id: 1,
      cardNumber: '4532-****-****-1234',
      cardType: 'debit',
      cardBrand: 'visa',
      expiryDate: '12/26',
      cvv: '***',
      accountId: 1,
      accountNumber: 'ACC-001',
      isActive: true,
      lastUsed: '2024-01-15'
    },
    {
      id: 2,
      cardNumber: '5555-****-****-5678',
      cardType: 'credit',
      cardBrand: 'mastercard',
      expiryDate: '08/27',
      cvv: '***',
      accountId: 2,
      accountNumber: 'ACC-002',
      isActive: true,
      creditLimit: 5000,
      availableCredit: 3500,
      currentBalance: 1500,
      lastUsed: '2024-01-14'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsData = await apiService.getAccounts();
      setAccounts(accountsData);
      
      // For now, use mock data
      setCards(mockCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateCardNumber = (brand: string): string => {
    const prefixes = {
      visa: ['4532', '4556', '4716'],
      mastercard: ['5555', '2223', '5100'],
      amex: ['3782', '3714']
    };
    
    const prefix = prefixes[brand as keyof typeof prefixes][Math.floor(Math.random() * prefixes[brand as keyof typeof prefixes].length)];
    const middle = '****-****';
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    
    return `${prefix}-${middle}-${last4}`;
  };

  const generateExpiryDate = (): string => {
    const currentYear = new Date().getFullYear();
    const year = currentYear + Math.floor(Math.random() * 5) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const handleAddCard = async () => {
    if (!newCard.accountId) {
      setError("Please select an account");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAccount = accounts.find(acc => acc.id === newCard.accountId);
      if (!selectedAccount) {
        setError("Selected account not found");
        return;
      }

      const cardNumber = generateCardNumber(newCard.cardBrand);
      const expiryDate = generateExpiryDate();
      const cvv = Math.floor(100 + Math.random() * 900).toString();

      const newCardData: Card = {
        id: cards.length + 1,
        cardNumber,
        cardType: newCard.cardType,
        cardBrand: newCard.cardBrand,
        expiryDate,
        cvv,
        accountId: newCard.accountId,
        accountNumber: selectedAccount.accountNumber,
        isActive: true,
        creditLimit: newCard.cardType === 'credit' ? newCard.creditLimit : undefined,
        availableCredit: newCard.cardType === 'credit' ? newCard.creditLimit : undefined,
        currentBalance: newCard.cardType === 'credit' ? 0 : undefined,
        lastUsed: undefined
      };

      setCards([...cards, newCardData]);
      
      // Reset form
      setNewCard({
        cardType: 'debit',
        cardBrand: 'visa',
        accountId: 0,
        creditLimit: 0
      });
      
      setActiveTab('view');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCardStatus = (cardId: number) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, isActive: !card.isActive }
        : card
    ));
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return '#28a745';
      case 'debit': return '#007bff';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading cards...</div>;

  return (
    <div className="main-content">
      <h2>💳 Card Management</h2>
      
      {error && <div className="error">Error: {error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
          data-icon="👁️"
        >
          <span>View Cards</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
          data-icon="➕"
        >
          <span>Add Card</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          data-icon="⚙️"
        >
          <span>Settings</span>
        </button>
      </div>

      {activeTab === 'view' && (
        <div className="cards-container">
          <h3>Your Cards</h3>
          {cards.length === 0 ? (
            <div className="no-cards">
              <p>No cards found. Add your first card to get started!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {cards.map(card => (
                <div key={card.id} className={`card-item ${!card.isActive ? 'inactive' : ''}`}>
                  <div className="card-header">
                    <div className="card-brand">
                      <span className="card-icon">{getCardBrandIcon(card.cardBrand)}</span>
                      <span className="card-type" style={{ color: getCardTypeColor(card.cardType) }}>
                        {card.cardType.toUpperCase()}
                      </span>
                    </div>
                    <div className="card-status">
                      <span className={`status-badge ${card.isActive ? 'active' : 'inactive'}`}>
                        {card.isActive ? 'Active' : 'Inactive'}
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

                  {card.cardType === 'credit' && (
                    <div className="credit-info">
                      <div className="credit-limit">
                        <span className="label">Credit Limit:</span>
                        <span className="value">${card.creditLimit?.toLocaleString()}</span>
                      </div>
                      <div className="available-credit">
                        <span className="label">Available:</span>
                        <span className="value">${card.availableCredit?.toLocaleString()}</span>
                      </div>
                      <div className="current-balance">
                        <span className="label">Balance:</span>
                        <span className="value">${card.currentBalance?.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {card.lastUsed && (
                    <div className="card-last-used">
                      <span className="label">Last Used:</span>
                      <span className="value">{new Date(card.lastUsed).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="card-actions">
                    <button
                      className={`btn ${card.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => toggleCardStatus(card.id)}
                    >
                      {card.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn btn-secondary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="add-card-form">
          <h3>Add New Card</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Card Type</label>
              <select
                value={newCard.cardType}
                onChange={(e) => setNewCard({...newCard, cardType: e.target.value as 'credit' | 'debit'})}
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
                onChange={(e) => setNewCard({...newCard, cardBrand: e.target.value as 'visa' | 'mastercard' | 'amex'})}
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
              onChange={(e) => setNewCard({...newCard, accountId: parseInt(e.target.value)})}
              required
            >
              <option value={0}>Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.currency} (${account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {newCard.cardType === 'credit' && (
            <div className="form-group">
              <label>Credit Limit</label>
              <input
                type="number"
                value={newCard.creditLimit || ''}
                onChange={(e) => setNewCard({...newCard, creditLimit: parseInt(e.target.value) || 0})}
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
            {isSubmitting ? 'Adding Card...' : 'Add Card'}
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card-settings">
          <h3>Card Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <h4>🔒 Security Settings</h4>
              <p>Manage your card security preferences</p>
              <button className="btn btn-secondary">Configure</button>
            </div>
            <div className="setting-item">
              <h4>📱 Mobile Payments</h4>
              <p>Set up Apple Pay, Google Pay, etc.</p>
              <button className="btn btn-secondary">Setup</button>
            </div>
            <div className="setting-item">
              <h4>🔔 Notifications</h4>
              <p>Configure transaction alerts</p>
              <button className="btn btn-secondary">Configure</button>
            </div>
            <div className="setting-item">
              <h4>📊 Spending Limits</h4>
              <p>Set daily/monthly spending limits</p>
              <button className="btn btn-secondary">Set Limits</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManagement;

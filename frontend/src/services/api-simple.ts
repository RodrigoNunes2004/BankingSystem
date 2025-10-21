// SIMPLIFIED API SERVICE - Only real API calls, no fallbacks, no complexity

export interface User {
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
  updatedAt?: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  availableBalance: number;
  userId: number;
  currency: string;
  isLocked: boolean;
  lastTransactionDate?: string;
  createdAt: string;
  updatedAt?: string;
  userName: string;
}

export interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  accountId: number;
  toAccountId?: number;
  description: string;
  status: string;
  referenceNumber: string;
  transactionDate: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
  accountNumber: string;
  toAccountNumber?: string;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description: string;
  category: string;
}

class SimpleApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api';
  }

  // Simple API call - no fallbacks, no complexity
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/test/users');
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>('/test/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>('/accounts');
  }

  async getAccount(id: number): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`);
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Transfer endpoint
  async processTransfer(transferData: TransferRequest): Promise<Transaction> {
    return this.request<Transaction>('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }
}

// Export a single instance
export const apiService = new SimpleApiService();

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api"
    : "http://localhost:5023/api");

// Fallback to mock data when API is unavailable
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === "true" || false;
const FORCE_MOCK_DATA = process.env.REACT_APP_FORCE_MOCK_DATA === "true" || false;

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

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateAccountRequest {
  accountType: string;
  userId: number;
  currency?: string;
}

export interface DepositRequest {
  accountId: number;
  amount: number;
  description: string;
}

export interface WithdrawalRequest {
  accountId: number;
  amount: number;
  description: string;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description: string;
  category: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Always use mock data for now since Azure API is down
      console.log(`Using mock data for endpoint: ${endpoint}`);
      return this.getMockData<T>(endpoint, options);
    } catch (error) {
      console.error(`Error in mock data for ${endpoint}:`, error);
      throw new Error(`Mock data error: ${error}`);
    }
  }

  private getMockData<T>(endpoint: string, options: RequestInit): T {
    // Mock data for when API is unavailable
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
        createdAt: "2024-01-01T00:00:00Z"
      }
    ];

    const mockAccounts: Account[] = [
      {
        id: 1,
        accountNumber: "7559546839",
        accountType: "Checking",
        balance: 8200.00,
        availableBalance: 8200.00,
        userId: 1,
        currency: "USD",
        isLocked: false,
        userName: "John Doe",
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        accountNumber: "6275708843",
        accountType: "Savings",
        balance: 1600.00,
        availableBalance: 1600.00,
        userId: 1,
        currency: "USD",
        isLocked: false,
        userName: "John Doe",
        createdAt: "2024-01-01T00:00:00Z"
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: 1,
        transactionType: "WITHDRAWAL",
        amount: 200.00,
        accountId: 1,
        description: "ATM Withdrawal",
        status: "Completed",
        referenceNumber: "TXN001",
        transactionDate: "2024-12-10T10:00:00Z",
        category: "Withdrawal",
        createdAt: "2024-12-10T10:00:00Z",
        accountNumber: "7559546839"
      },
      {
        id: 2,
        transactionType: "TRANSFER",
        amount: 800.00,
        accountId: 1,
        toAccountId: 2,
        description: "Transfer to Savings",
        status: "Completed",
        referenceNumber: "TXN002",
        transactionDate: "2024-12-10T09:00:00Z",
        category: "Transfer",
        createdAt: "2024-12-10T09:00:00Z",
        accountNumber: "7559546839"
      }
    ];

    // Return appropriate mock data based on endpoint
    if (endpoint === "/users") return mockUsers as T;
    if (endpoint === "/accounts") return mockAccounts as T;
    if (endpoint.includes("/transactions/date-range")) return mockTransactions as T;
    if (endpoint.includes("/transactions/account/")) return mockTransactions as T;
    if (endpoint.includes("/transactions/user/")) return mockTransactions as T;
    
    // Default empty response for other endpoints
    return [] as T;
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users");
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.request<User>(`/users/email/${email}`);
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(
    id: number,
    user: Partial<CreateUserRequest>
  ): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>("/accounts");
  }

  async getAccount(id: number): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`);
  }

  async getAccountByNumber(accountNumber: string): Promise<Account> {
    return this.request<Account>(`/accounts/number/${accountNumber}`);
  }

  async getAccountsByUser(userId: number): Promise<Account[]> {
    return this.request<Account[]>(`/accounts/user/${userId}`);
  }

  async createAccount(account: CreateAccountRequest): Promise<Account> {
    return this.request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(account),
    });
  }

  async updateAccount(
    id: number,
    account: Partial<CreateAccountRequest>
  ): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(account),
    });
  }

  async deleteAccount(id: number): Promise<void> {
    return this.request<void>(`/accounts/${id}`, {
      method: "DELETE",
    });
  }

  // Transaction endpoints
  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`);
  }

  async getTransactionsByAccount(accountId: number): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/account/${accountId}`);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/user/${userId}`);
  }

  async getTransactionsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    return this.request<Transaction[]>(
      `/transactions/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async processDeposit(deposit: DepositRequest): Promise<Transaction> {
    return this.request<Transaction>("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify(deposit),
    });
  }

  async processWithdrawal(withdrawal: WithdrawalRequest): Promise<Transaction> {
    return this.request<Transaction>("/transactions/withdrawal", {
      method: "POST",
      body: JSON.stringify(withdrawal),
    });
  }

  async processTransfer(transfer: TransferRequest): Promise<Transaction> {
    return this.request<Transaction>("/transactions/transfer", {
      method: "POST",
      body: JSON.stringify(transfer),
    });
  }
}

export const apiService = new ApiService();

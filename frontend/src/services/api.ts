const API_BASE_URL = "http://localhost:5023/api";

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
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
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

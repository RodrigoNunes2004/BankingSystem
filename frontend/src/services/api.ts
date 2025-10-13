// API configuration - using mock data for now

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
  // In-memory storage for mock data - NO DEFAULT VALUES
  private mockUsers: User[] = [];
  private mockAccounts: Account[] = [];
  private mockTransactions: Transaction[] = [];

  // Get current user from localStorage
  private getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem("banking_user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Get user-specific data key
  private getUserDataKey(userId: number, dataType: string): string {
    return `banking_${dataType}_${userId}`;
  }

  // Load user-specific data
  private loadUserData<T>(
    userId: number,
    dataType: string,
    defaultValue: T[]
  ): T[] {
    try {
      const key = this.getUserDataKey(userId, dataType);
      const data = localStorage.getItem(key);
      const result = data ? JSON.parse(data) : defaultValue;
      console.log(`Loaded ${dataType} for user ${userId}:`, result); // Debug log
      return result;
    } catch (error) {
      console.error(`Error loading ${dataType} for user ${userId}:`, error); // Debug log
      return defaultValue;
    }
  }

  // Save user-specific data
  private saveUserData<T>(userId: number, dataType: string, data: T[]): void {
    try {
      const key = this.getUserDataKey(userId, dataType);
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved ${dataType} for user ${userId}:`, data); // Debug log
    } catch (error) {
      console.error(`Error saving ${dataType} data:`, error);
    }
  }

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
    const method = options.method || "GET";
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Load user-specific data
    const userAccounts = this.loadUserData<Account>(
      currentUser.id,
      "accounts",
      []
    );
    const userTransactions = this.loadUserData<Transaction>(
      currentUser.id,
      "transactions",
      []
    );

    // Handle CRUD operations for users
    if (endpoint === "/users") {
      if (method === "POST") {
        const newUser = JSON.parse(options.body as string) as CreateUserRequest;
        const user: User = {
          id: Math.max(...this.mockUsers.map((u) => u.id), 0) + 1,
          ...newUser,
          fullName: `${newUser.firstName} ${newUser.lastName}`,
          createdAt: new Date().toISOString(),
        };
        this.mockUsers.push(user);
        return user as T;
      }
      return this.mockUsers as T;
    }

    if (endpoint.startsWith("/users/") && !endpoint.includes("/email/")) {
      const id = parseInt(endpoint.split("/")[2]);
      if (method === "PUT") {
        const updateData = JSON.parse(
          options.body as string
        ) as Partial<CreateUserRequest>;
        const userIndex = this.mockUsers.findIndex((u) => u.id === id);
        if (userIndex !== -1) {
          this.mockUsers[userIndex] = {
            ...this.mockUsers[userIndex],
            ...updateData,
            fullName: `${
              updateData.firstName || this.mockUsers[userIndex].firstName
            } ${updateData.lastName || this.mockUsers[userIndex].lastName}`,
            updatedAt: new Date().toISOString(),
          };
          return this.mockUsers[userIndex] as T;
        }
      } else if (method === "DELETE") {
        this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
        return undefined as T;
      } else {
        const user = this.mockUsers.find((u) => u.id === id);
        return user as T;
      }
    }

    if (endpoint.includes("/users/email/")) {
      const email = endpoint.split("/email/")[1];
      const user = this.mockUsers.find((u) => u.email === email);
      return user as T;
    }

    // Handle CRUD operations for accounts
    if (endpoint === "/accounts") {
      if (method === "POST") {
        const newAccount = JSON.parse(
          options.body as string
        ) as CreateAccountRequest;
        const account: Account = {
          id: Math.max(...userAccounts.map((a) => a.id), 0) + 1,
          accountNumber: Math.floor(
            1000000000 + Math.random() * 9000000000
          ).toString(),
          balance: 0,
          availableBalance: 0,
          currency: newAccount.currency || "USD",
          isLocked: false,
          userName: currentUser.fullName,
          createdAt: new Date().toISOString(),
          ...newAccount,
        };
        userAccounts.push(account);
        this.saveUserData(currentUser.id, "accounts", userAccounts);
        return account as T;
      }
      return userAccounts as T;
    }

    if (
      endpoint.startsWith("/accounts/") &&
      !endpoint.includes("/number/") &&
      !endpoint.includes("/user/")
    ) {
      const id = parseInt(endpoint.split("/")[2]);
      if (method === "PUT") {
        const updateData = JSON.parse(
          options.body as string
        ) as Partial<CreateAccountRequest>;
        const accountIndex = userAccounts.findIndex((a) => a.id === id);
        if (accountIndex !== -1) {
          userAccounts[accountIndex] = {
            ...userAccounts[accountIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
          };
          this.saveUserData(currentUser.id, "accounts", userAccounts);
          return userAccounts[accountIndex] as T;
        }
      } else if (method === "DELETE") {
        const filteredAccounts = userAccounts.filter((a) => a.id !== id);
        this.saveUserData(currentUser.id, "accounts", filteredAccounts);
        return undefined as T;
      } else {
        const account = userAccounts.find((a) => a.id === id);
        return account as T;
      }
    }

    if (endpoint.includes("/accounts/number/")) {
      const accountNumber = endpoint.split("/number/")[1];
      const account = userAccounts.find(
        (a) => a.accountNumber === accountNumber
      );
      return account as T;
    }

    if (endpoint.includes("/accounts/user/")) {
      const userId = parseInt(endpoint.split("/user/")[1]);
      const accounts = userAccounts.filter((a) => a.userId === userId);
      return accounts as T;
    }

    // Handle transaction endpoints
    if (endpoint.includes("/transactions/date-range")) {
      console.log("Returning transactions for date range:", userTransactions); // Debug log
      return userTransactions as T;
    }
    if (endpoint.includes("/transactions/account/")) {
      return userTransactions as T;
    }
    if (endpoint.includes("/transactions/user/")) {
      return userTransactions as T;
    }
    if (
      endpoint.startsWith("/transactions/") &&
      !endpoint.includes("/date-range") &&
      !endpoint.includes("/account/") &&
      !endpoint.includes("/user/")
    ) {
      const id = parseInt(endpoint.split("/")[2]);
      const transaction = userTransactions.find((t) => t.id === id);
      return transaction as T;
    }

    // Handle transaction creation endpoints
    if (
      endpoint === "/transactions/deposit" ||
      endpoint === "/transactions/withdrawal" ||
      endpoint === "/transactions/transfer"
    ) {
      const transactionData = JSON.parse(options.body as string);
      const transaction: Transaction = {
        id: userTransactions.length > 0 ? Math.max(...userTransactions.map((t) => t.id), 0) + 1 : 1,
        transactionType: endpoint.includes("deposit")
          ? "DEPOSIT"
          : endpoint.includes("withdrawal")
          ? "WITHDRAWAL"
          : "TRANSFER",
        referenceNumber: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Completed",
        transactionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        accountNumber:
          userAccounts.find(
            (a) =>
              a.id === transactionData.accountId ||
              a.id === transactionData.fromAccountId
          )?.accountNumber || "",
        ...transactionData,
      };
      userTransactions.push(transaction);
      this.saveUserData(currentUser.id, "transactions", userTransactions);
      console.log("Created transaction:", transaction); // Debug log
      console.log("All user transactions:", userTransactions); // Debug log
      return transaction as T;
    }

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

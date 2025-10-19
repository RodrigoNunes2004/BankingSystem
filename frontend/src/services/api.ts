// API configuration - using real Azure API

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
  // Removed mockUsers - now using localStorage directly
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
      console.log(`📥 Loaded ${dataType} for user ${userId}:`, result);
      console.log(`📥 Key used: ${key}`);
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
      console.log(`💾 Saved ${dataType} for user ${userId}:`, data);
      console.log(`💾 Key used: ${key}`);
    } catch (error) {
      console.error(`Error saving ${dataType} data:`, error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Use real Azure API
      const baseUrl = process.env.REACT_APP_API_URL || 'https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api';
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`Making API request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Error calling API for ${endpoint}:`, error);
      // Fallback to mock data if API fails
      console.log(`Falling back to mock data for endpoint: ${endpoint}`);
      return this.getMockData<T>(endpoint, options);
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
    if (endpoint === "/simpleusers") {
      if (method === "POST") {
        const newUser = JSON.parse(options.body as string) as CreateUserRequest;
        const user: User = {
          id: Date.now(), // Use same ID generation as AuthContext
          ...newUser,
          fullName: `${newUser.firstName} ${newUser.lastName}`,
          createdAt: new Date().toISOString(),
        };

        // Save to localStorage using same system as AuthContext
        const existingUsers = JSON.parse(
          localStorage.getItem("banking_users") || "[]"
        );
        existingUsers.push(user);
        localStorage.setItem("banking_users", JSON.stringify(existingUsers));

        console.log("✅ Created user and saved to localStorage:", user);
        return user as T;
      }

      // Load users from localStorage (same as AuthContext)
      const users = JSON.parse(localStorage.getItem("banking_users") || "[]");
      console.log("📥 Loaded users from localStorage:", users);
      return users as T;
    }

    if (endpoint.startsWith("/users/") && !endpoint.includes("/email/")) {
      const id = parseInt(endpoint.split("/")[2]);
      const users = JSON.parse(localStorage.getItem("banking_users") || "[]");

      if (method === "PUT") {
        const updateData = JSON.parse(
          options.body as string
        ) as Partial<CreateUserRequest>;
        const userIndex = users.findIndex((u: User) => u.id === id);
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            fullName: `${updateData.firstName || users[userIndex].firstName} ${
              updateData.lastName || users[userIndex].lastName
            }`,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem("banking_users", JSON.stringify(users));
          console.log("✅ Updated user in localStorage:", users[userIndex]);
          return users[userIndex] as T;
        }
      } else if (method === "DELETE") {
        const filteredUsers = users.filter((u: User) => u.id !== id);
        localStorage.setItem("banking_users", JSON.stringify(filteredUsers));
        console.log("✅ Deleted user from localStorage");
        return undefined as T;
      } else {
        const user = users.find((u: User) => u.id === id);
        return user as T;
      }
    }

    if (endpoint.includes("/users/email/")) {
      const email = endpoint.split("/email/")[1];
      const users = JSON.parse(localStorage.getItem("banking_users") || "[]");
      const user = users.find((u: User) => u.email === email);
      return user as T;
    }

    // Handle CRUD operations for accounts
    if (endpoint === "/accounts") {
      if (method === "POST") {
        const newAccount = JSON.parse(
          options.body as string
        ) as CreateAccountRequest;
        const account: Account = {
          id:
            userAccounts.length > 0
              ? Math.max(...userAccounts.map((a) => a.id), 0) + 1
              : 1,
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
      console.log(
        "📥 Loading transactions for date range from localStorage..."
      );
      console.log("📥 User ID:", currentUser.id);
      console.log("📥 Key used:", `banking_transactions_${currentUser.id}`);
      console.log(
        "📥 Raw localStorage data:",
        localStorage.getItem(`banking_transactions_${currentUser.id}`)
      );
      console.log("📥 Parsed transactions:", userTransactions);
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
      console.log("🚨 TRANSACTION CREATION ENDPOINT HIT:", endpoint);
      const transactionData = JSON.parse(options.body as string);
      console.log("🔍 Creating transaction with data:", transactionData);
      console.log(
        "🔍 Current user transactions before creation:",
        userTransactions
      );
      console.log("🔍 Current user accounts before creation:", userAccounts);
      console.log("🔍 Current user ID:", currentUser.id);

      const transaction: Transaction = {
        id:
          userTransactions.length > 0
            ? Math.max(...userTransactions.map((t) => t.id)) + 1
            : 1,
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

      // Update account balances based on transaction type
      if (endpoint === "/transactions/deposit") {
        const account = userAccounts.find(
          (a) => a.id === transactionData.accountId
        );
        if (account) {
          account.balance += transactionData.amount;
          account.availableBalance += transactionData.amount;
        }
      } else if (endpoint === "/transactions/withdrawal") {
        const account = userAccounts.find(
          (a) => a.id === transactionData.accountId
        );
        if (account) {
          account.balance -= transactionData.amount;
          account.availableBalance -= transactionData.amount;
        }
      } else if (endpoint === "/transactions/transfer") {
        const fromAccount = userAccounts.find(
          (a) => a.id === transactionData.fromAccountId
        );
        const toAccount = userAccounts.find(
          (a) => a.id === transactionData.toAccountId
        );
        if (fromAccount && toAccount) {
          fromAccount.balance -= transactionData.amount;
          fromAccount.availableBalance -= transactionData.amount;
          toAccount.balance += transactionData.amount;
          toAccount.availableBalance += transactionData.amount;
        }
      }

      // Save updated accounts and transactions
      this.saveUserData(currentUser.id, "accounts", userAccounts);
      this.saveUserData(currentUser.id, "transactions", userTransactions);

      // Verify data was saved to localStorage
      const savedTransactions = JSON.parse(
        localStorage.getItem(`banking_transactions_${currentUser.id}`) || "[]"
      );
      console.log(
        "🔍 VERIFICATION - Transactions in localStorage after save:",
        savedTransactions
      );

      console.log("✅ Created transaction:", transaction);
      console.log("✅ Updated account balances:", userAccounts);
      console.log("✅ All user transactions after save:", userTransactions);
      console.log(
        "✅ Transaction saved to localStorage for user:",
        currentUser.id
      );
      console.log("🚨 RETURNING TRANSACTION:", transaction);

      return transaction as T;
    }

    // Default empty response for other endpoints
    return [] as T;
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/simpleusers");
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.request<User>(`/users/email/${email}`);
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    return this.request<User>("/simpleusers", {
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

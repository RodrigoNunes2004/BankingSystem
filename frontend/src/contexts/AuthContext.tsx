import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'fullName' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('banking_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('banking_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll use a simple email-based login
      // In a real app, this would call your authentication API
      const users = JSON.parse(localStorage.getItem('banking_users') || '[]');
      const foundUser = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // For demo, any password works. In real app, verify password hash
        setUser(foundUser);
        localStorage.setItem('banking_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'fullName' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const users = JSON.parse(localStorage.getItem('banking_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: User) => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return false; // User already exists
      }
      
      const newUser: User = {
        ...userData,
        id: Date.now(), // Simple ID generation
        fullName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('banking_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('banking_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('banking_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

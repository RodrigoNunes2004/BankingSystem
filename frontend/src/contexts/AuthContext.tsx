import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  register: (
    userData: Omit<User, "id" | "fullName" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // No longer initializing demo users - using real API

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Clear any old mock data that might interfere
        localStorage.removeItem("banking_users");
        
        // Check for saved user session
        const savedUser = localStorage.getItem("banking_user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("banking_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Try the real Azure API first
      const baseUrl = process.env.REACT_APP_API_URL || 'https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api';
      console.log(`Attempting to login with email: ${email}`);
      console.log(`API URL: ${baseUrl}/users`);
      
      try {
        const response = await fetch(`${baseUrl}/simpleusers`);
        
        if (response.ok) {
          const users: User[] = await response.json();
          console.log(`Retrieved ${users.length} users from API:`, users);
          
          const foundUser = users.find(
            (u: User) => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (foundUser) {
            console.log(`User found:`, foundUser);
            setUser(foundUser);
            localStorage.setItem("banking_user", JSON.stringify(foundUser));
            return true;
          }
        }
      } catch (apiError) {
        console.log("API call failed, falling back to mock data:", apiError);
      }
      
      // Fallback to mock data for demo purposes
      console.log("Using mock data for login");
      const mockUsers: User[] = [
        {
          id: 1,
          firstName: "Rodrigo",
          lastName: "Nunes",
          email: "rodrigo79rfn@gmail.com",
          phoneNumber: "0212253555",
          dateOfBirth: "1990-01-01",
          address: "123 Demo Street",
          city: "Demo City",
          postalCode: "1234",
          country: "New Zealand",
          fullName: "Rodrigo Nunes",
          createdAt: new Date().toISOString(),
          updatedAt: undefined
        }
      ];
      
      const foundUser = mockUsers.find(
        (u: User) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (foundUser) {
        console.log(`User found in mock data:`, foundUser);
        setUser(foundUser);
        localStorage.setItem("banking_user", JSON.stringify(foundUser));
        return true;
      }
      
      console.log(`User not found for email: ${email}`);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, "id" | "fullName" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Try the real Azure API first
      const baseUrl = process.env.REACT_APP_API_URL || 'https://banking-system-api-evfxbwhgaband4d7.australiaeast-01.azurewebsites.net/api';
      
      try {
        const response = await fetch(`${baseUrl}/simpleusers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const newUser: User = await response.json();
          setUser(newUser);
          localStorage.setItem("banking_user", JSON.stringify(newUser));
          return true;
        } else if (response.status === 409) {
          return false; // User already exists
        }
      } catch (apiError) {
        console.log("API call failed, falling back to mock registration:", apiError);
      }
      
      // Fallback to mock registration for demo purposes
      console.log("Using mock data for registration");
      const newUser: User = {
        ...userData,
        id: Date.now(), // Simple ID generation
        fullName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: undefined
      };
      
      setUser(newUser);
      localStorage.setItem("banking_user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("banking_user");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

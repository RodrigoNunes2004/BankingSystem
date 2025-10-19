import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Unable to connect to the server. Please check your internet connection and try again.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🏦 Banking System</h2>
        <h3>Sign in to your account</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="btn btn-primary auth-btn">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToRegister} className="link-button">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

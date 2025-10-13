import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthApp: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-app">
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthApp;

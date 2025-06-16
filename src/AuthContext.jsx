import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Carrega dados do localStorage ao montar o provedor
  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      setToken(userData.token);
      setUserEmail(userData.email);
    }
  }, []);

  const login = ({ token, email }) => {
    const userData = { token, email };
    setToken(token);
    setUserEmail(email);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
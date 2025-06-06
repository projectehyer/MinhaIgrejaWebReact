import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const AuthContext = createContext();

// Hook para consumir o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor do contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Puxa do localStorage no início (se tiver)
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Função para login: salva usuário e token no estado e localStorage
  const login = ({ token, email }) => {
    const userData = { token, email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Função para logout: limpa estado e localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Opcional: se quiser controlar token expirado, pode fazer aqui com useEffect

  const value = {
    user,
    token: user?.token,
    email: user?.email,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
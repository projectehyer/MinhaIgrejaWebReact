import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Carrega dados do localStorage ao montar o provedor
  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      setToken(userData.token);
      setRefreshToken(userData.refresh_token);
      setUserEmail(userData.email);
    }
  }, []);

  const refreshSession = async () => {
    try {
      const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
      const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;
      
      const response = await api.post(
        baseUrl.concat('/auth/v1/token?grant_type=refresh_token'),
        { refresh_token: refreshToken },
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          }
        }
      );

      const { access_token, refresh_token } = response.data;
      
      // Atualiza os tokens
      const userData = {
        token: access_token,
        refresh_token,
        email: userEmail
      };
      
      setToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return access_token;
    } catch (error) {
      // Se falhar em renovar, faz logout
      logout();
      throw new Error('Falha ao renovar sessão');
    }
  };

  const login = ({ token, refresh_token, email }) => {
    const userData = { token, refresh_token, email };
    setToken(token);
    setRefreshToken(refresh_token);
    setUserEmail(email);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUserEmail(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      userEmail, 
      login, 
      logout,
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
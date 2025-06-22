import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/ui/NotFound';
import EmailConfirmation from './components/auth/EmailConfirmation';
import PasswordReset from './components/auth/PasswordReset';
import PasswordUpdate from './components/auth/PasswordUpdate';
import AuthCallback from './components/auth/AuthCallback';
import { useAuth } from './contexts/AuthContext';
import ConteudoDetalhe from './components/content/ConteudoDetalhe';
import { setupAxiosInterceptors } from './utils/axios';
import './styles/App.css';

function App() {
  const { token, refreshSession, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors({ refreshSession, logout, navigate });
    }
  }, [token, refreshSession, logout, navigate]);

  // Se o token ainda não foi carregado do localStorage
  if (token === undefined) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={!token ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/signup" 
        element={!token ? <Signup /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/confirm-email" 
        element={<EmailConfirmation />} 
      />
      <Route 
        path="/reset-password" 
        element={<PasswordReset />} 
      />
      <Route 
        path="/update-password" 
        element={<PasswordUpdate />} 
      />
      <Route 
        path="/auth/callback" 
        element={<AuthCallback />} 
      />
      <Route 
        path="/dashboard" 
        element={token ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="/conteudo/:id" element={<ConteudoDetalhe />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

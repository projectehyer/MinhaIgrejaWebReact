import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import { useAuth } from './AuthContext';
import ConteudoDetalhe from './ConteudoDetalhe';
import { setupAxiosInterceptors } from './axios';

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
        path="/dashboard" 
        element={token ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="/conteudo/:id" element={<ConteudoDetalhe />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

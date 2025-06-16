import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import { useAuth } from './AuthContext';

function App() {
  const { token } = useAuth();

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

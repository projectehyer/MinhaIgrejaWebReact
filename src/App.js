import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';  // Crie esse componente
import NotFound from './NotFound';    // Crie esse componente

import { useAuth } from './AuthContext';

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

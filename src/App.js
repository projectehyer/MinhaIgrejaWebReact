import React from 'react';
import Login from './Login';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}

export default App;
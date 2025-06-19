import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        baseUrl.concat('/auth/v1/token?grant_type=password'),
        { email, password },
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          }
        }
      );
      login({ 
        token: res.data.access_token, 
        refresh_token: res.data.refresh_token,
        email: res.data.user.email 
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #2c3e50 0%, #4e73df 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
        padding: '40px 30px',
        maxWidth: '350px',
        width: '100%'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#2c3e50',
          fontWeight: 700
        }}>Minha Igreja</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="E-mail"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#f8fafc',
              transition: 'border 0.2s'
            }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Senha"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#f8fafc',
              transition: 'border 0.2s'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#a5b4fc' : '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '10px',
              boxShadow: '0 2px 8px rgba(78,115,223,0.10)'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

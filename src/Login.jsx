import React, { useState } from 'react';
import api from './axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ facebook: false, google: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
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

  const handleSocialLogin = async (provider) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    setError(null);

    try {
      // Redirecionar para OAuth do Supabase
      const redirectUrl = `${baseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
      window.location.href = redirectUrl;
    } catch (err) {
      setError(`Erro ao conectar com ${provider}`);
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  const handleGoToPasswordReset = () => {
    navigate('/reset-password');
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
        
        {/* Login Social */}
        <div style={{ marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading.google}
            style={{
              width: '100%',
              padding: '12px',
              background: '#fff',
              color: '#333',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: socialLoading.google ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {socialLoading.google ? (
              'Conectando...'
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading.facebook}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1877f2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: socialLoading.facebook ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {socialLoading.facebook ? (
              'Conectando...'
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar com Facebook
              </>
            )}
          </button>
        </div>

        {/* Separador */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#d1d5db'
          }}></div>
          <span style={{
            padding: '0 16px',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}>ou</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#d1d5db'
          }}></div>
        </div>

        {/* Login com Email/Senha */}
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
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(78,115,223,0.10)'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button
            type="button"
            onClick={handleGoToSignup}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#4e73df',
              border: '1px solid #4e73df',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            Criar nova conta
          </button>
          <button
            type="button"
            onClick={handleGoToPasswordReset}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              color: '#6b7280',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Esqueceu sua senha?
          </button>
        </form>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

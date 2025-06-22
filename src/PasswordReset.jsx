import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(
        `${baseUrl}/auth/v1/recover`,
        {
          email: email,
          redirect_to: `${window.location.origin}/update-password`
        },
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          }
        }
      );

      setSuccess(true);

    } catch (error) {
      console.error('Erro ao enviar email de reset:', error);
      
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error.response?.status === 400) {
        errorMessage = 'Email não encontrado ou inválido.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Aguarde um momento.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (success) {
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
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Email enviado!</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Enviamos um link de recuperação para <strong>{email}</strong>. 
            Verifique sua caixa de entrada e siga as instruções.
          </p>
          <button
            onClick={handleBackToLogin}
            style={{
              padding: '12px 24px',
              background: '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(78,115,223,0.10)'
            }}
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

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
        }}>Recuperar Senha</h2>
        <p style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="E-mail"
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
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(78,115,223,0.10)'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Email'}
          </button>
          <button
            type="button"
            onClick={handleBackToLogin}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#4e73df',
              border: '1px solid #4e73df',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Voltar para o Login
          </button>
        </form>
        {error && (
          <p style={{ 
            color: '#e74c3c', 
            textAlign: 'center', 
            marginTop: '16px',
            fontSize: '0.9rem'
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
} 
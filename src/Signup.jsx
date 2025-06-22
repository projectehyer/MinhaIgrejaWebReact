import React, { useState } from 'react';
import api from './axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Verificar se as variáveis de ambiente estão configuradas
      if (!apiKey || !baseUrl) {
        throw new Error('Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.');
      }

      // Criar usuário no Supabase
      const res = await api.post(
        baseUrl.concat('/auth/v1/signup'),
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 segundos de timeout
        }
      );

      // Verificar se precisa confirmar email
      if (res.data.user && !res.data.user.email_confirmed_at) {
        // Email de confirmação necessário
        setSuccess(true);
      } else if (res.data.access_token) {
        // Login automático (email confirmation desabilitado)
        setSuccess(true);
      } else {
        // Caso padrão
        setSuccess(true);
      }

    } catch (err) {
      console.error('Erro no signup:', err);
      
      let errorMessage = 'Erro ao criar conta';
      
      if (err.code === 'NETWORK_ERROR' || err.message.includes('ERR_INTERNET_DISCONNECTED')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
      } else if (err.response?.status === 400) {
        const supabaseError = err.response?.data?.error_description || err.response?.data?.msg;
        if (supabaseError) {
          errorMessage = supabaseError;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados inválidos. Verifique o formato do email e senha.';
      } else if (err.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Aguarde um momento e tente novamente.';
      } else if (err.message.includes('Configuração')) {
        errorMessage = err.message;
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Conta criada com sucesso!</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Sua conta foi criada. Agora você pode fazer login com seu email e senha.
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
            Ir para o Login
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
        }}>Criar Conta</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Senha (mín. 6 caracteres)"
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirmar senha"
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
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
            Já tenho uma conta
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
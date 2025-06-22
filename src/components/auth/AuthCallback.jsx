import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';

export default function AuthCallback() {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obter parâmetros da URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Se há erro na URL
        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Erro na autenticação social');
          return;
        }

        // Se não há código de autorização
        if (!code) {
          setStatus('error');
          setMessage('Código de autorização não encontrado');
          return;
        }

        // Trocar código por token
        const response = await api.post(
          `${baseUrl}/auth/v1/token?grant_type=authorization_code`,
          {
            auth_code: code,
            redirect_to: window.location.origin + '/auth/callback'
          },
          {
            headers: {
              'apikey': apiKey,
              'Content-Type': 'application/json',
            }
          }
        );

        // Login bem-sucedido
        if (response.data.access_token) {
          login({
            token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            email: response.data.user.email
          });
          
          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          
          // Redirecionar para dashboard após um breve delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          throw new Error('Token não recebido');
        }

      } catch (error) {
        console.error('Erro no callback:', error);
        
        let errorMessage = 'Erro ao processar login social';
        
        if (error.response?.status === 400) {
          errorMessage = 'Código de autorização inválido ou expirado';
        } else if (error.response?.status === 422) {
          errorMessage = 'Dados de autorização inválidos';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Erro de conexão. Verifique sua internet';
        } else if (error.response?.data?.error_description) {
          errorMessage = error.response.data.error_description;
        }
        
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, apiKey, baseUrl, login, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const renderContent = () => {
    if (status === 'processing') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Processando login...</h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Aguarde enquanto finalizamos sua autenticação.
          </p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Login realizado!</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Erro no login</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
          <button
            onClick={handleGoToLogin}
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
      );
    }

    return null;
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
        maxWidth: '400px',
        width: '100%'
      }}>
        {renderContent()}
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/axios';

export default function EmailConfirmation() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Obter token da URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setStatus('error');
          setMessage('Token de confirmação não encontrado na URL.');
          setLoading(false);
          return;
        }

        // Verificar se é confirmação de email
        if (type !== 'signup') {
          setStatus('error');
          setMessage('Tipo de confirmação inválido.');
          setLoading(false);
          return;
        }

        // Confirmar email no Supabase
        const response = await api.post(
          `${baseUrl}/auth/v1/verify`,
          {
            token_hash: token,
            type: 'signup'
          },
          {
            headers: {
              'apikey': apiKey,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data) {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Sua conta está ativa.');
        } else {
          setStatus('error');
          setMessage('Erro ao confirmar email. Tente novamente.');
        }

      } catch (error) {
        console.error('Erro na confirmação:', error);
        
        let errorMessage = 'Erro ao confirmar email';
        
        if (error.response?.status === 400) {
          errorMessage = 'Token inválido ou expirado.';
        } else if (error.response?.status === 422) {
          errorMessage = 'Dados de confirmação inválidos.';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (error.response?.data?.error_description) {
          errorMessage = error.response.data.error_description;
        }
        
        setStatus('error');
        setMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, apiKey, baseUrl]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const email = searchParams.get('email');
      
      if (!email) {
        setMessage('Email não encontrado. Tente fazer signup novamente.');
        setLoading(false);
        return;
      }

      await api.post(
        `${baseUrl}/auth/v1/recover`,
        {
          email: email
        },
        {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          }
        }
      );

      setMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      setMessage('Erro ao reenviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Confirmando seu email...</h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Aguarde enquanto verificamos sua conta.
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
          }}>Email confirmado!</h2>
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
            Fazer Login
          </button>
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
          }}>Erro na confirmação</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleResendEmail}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Reenviar Email'}
            </button>
            <button
              onClick={handleGoToLogin}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#4e73df',
                border: '1px solid #4e73df',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Ir para Login
            </button>
          </div>
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
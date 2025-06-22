import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from './axios';

export default function PasswordUpdate() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
  const baseUrl = process.env.REACT_APP_SUPABASE_API_BASE_URL;

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setError('Token de recuperação não encontrado.');
          setValidating(false);
          return;
        }

        if (type !== 'recovery') {
          setError('Tipo de token inválido.');
          setValidating(false);
          return;
        }

        // Validar token (opcional - o Supabase já valida na hora de atualizar)
        setTokenValid(true);
        setValidating(false);

      } catch (error) {
        setError('Erro ao validar token.');
        setValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = async (e) => {
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
      const token = searchParams.get('token');

      // Atualizar senha no Supabase
      const response = await api.post(
        `${baseUrl}/auth/v1/user`,
        {
          password: formData.password
        },
        {
          headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setSuccess(true);

    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      
      let errorMessage = 'Erro ao atualizar senha';
      
      if (error.response?.status === 400) {
        errorMessage = 'Token inválido ou expirado. Solicite um novo link.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Senha inválida. Tente uma senha diferente.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.response?.data?.error_description) {
        errorMessage = error.response.data.error_description;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleRequestNewLink = () => {
    navigate('/reset-password');
  };

  if (validating) {
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Validando link...</h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Aguarde enquanto verificamos seu link de recuperação.
          </p>
        </div>
      </div>
    );
  }

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
          }}>Senha atualizada!</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
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
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{
            marginBottom: '16px',
            color: '#2c3e50',
            fontWeight: 700
          }}>Link inválido</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {error || 'Este link de recuperação é inválido ou expirou.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleRequestNewLink}
              style={{
                padding: '12px 24px',
                background: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Solicitar novo link
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
        }}>Nova Senha</h2>
        <p style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          Digite sua nova senha abaixo.
        </p>
        <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Nova senha (mín. 6 caracteres)"
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
            placeholder="Confirmar nova senha"
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
            {loading ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
          <button
            type="button"
            onClick={handleGoToLogin}
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
            Cancelar
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
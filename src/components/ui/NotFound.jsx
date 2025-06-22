import React from 'react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6fa',
      padding: '2rem',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 500,
      }}>
        <h1 style={{
          fontSize: '6rem',
          margin: 0,
          color: '#4e73df',
          fontWeight: 'bold',
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '2rem',
          margin: '1rem 0',
          color: '#333',
        }}>
          Página não encontrada
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem',
        }}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            background: '#4e73df',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.target.style.background = '#3a5fcd'}
          onMouseOut={(e) => e.target.style.background = '#4e73df'}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default NotFound;

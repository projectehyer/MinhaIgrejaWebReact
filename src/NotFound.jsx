import React from 'react';

const ConteudoDetalhe = ({ conteudo, onClose }) => {
  if (!conteudo) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        maxWidth: 500,
        width: '90%',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(44,62,80,0.15)',
        position: 'relative',
        textAlign: 'center',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'none',
          border: 'none',
          fontSize: 28,
          color: '#888',
          cursor: 'pointer',
        }}>&times;</button>
        <h2 style={{ marginBottom: 24 }}>{conteudo.titulo}</h2>
        {conteudo.imagem && (
          <img src={conteudo.imagem} alt={conteudo.titulo} style={{
            width: '100%',
            maxHeight: 300,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 24,
          }} />
        )}
        <div style={{ fontSize: '1.1rem', color: '#333', textAlign: 'left' }}>{conteudo.texto}</div>
      </div>
    </div>
  );
};

export default ConteudoDetalhe;

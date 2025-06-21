import React, { useEffect, useState } from 'react';
import api from './axios';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_API_BASE_URL;
const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;

const ConteudoDetalhe = ({ id, onClose, embedded }) => {
  const [conteudo, setConteudo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchConteudo = async () => {
      try {
        const res = await api.get(
          `${SUPABASE_URL}/rest/v1/conteudo?id=eq.${id}`,
          {
            headers: {
              apikey: SUPABASE_API_KEY,
              Authorization: `Bearer ${SUPABASE_API_KEY}`,
            },
          }
        );
        setConteudo(res.data[0] || null);
      } catch {
        setConteudo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchConteudo();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</div>;
  if (!conteudo) return <div style={{ textAlign: 'center', marginTop: 40 }}>Conteúdo não encontrado.</div>;

  if (embedded) {
    return (
      <div style={{
        background: '#f5f6fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
        minHeight: '100%',
      }}>
        <button onClick={onClose} style={{
          alignSelf: 'flex-end',
          marginBottom: 24,
          background: 'none',
          border: 'none',
          fontSize: 24,
          color: '#4e73df',
          cursor: 'pointer',
        }}>&times;</button>
        <h2 style={{ marginBottom: 24 }}>{conteudo.titulo}</h2>
        {conteudo.imagem && (
          <img src={conteudo.imagem} alt={conteudo.titulo} style={{
            width: '100%',
            maxWidth: 500,
            maxHeight: 350,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 24,
          }} />
        )}
        <div style={{ fontSize: '1.1rem', color: '#333', textAlign: 'left', maxWidth: 600 }}>{conteudo.texto}</div>
      </div>
    );
  }

  // Versão standalone (rota)
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f6fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem 1rem',
    }}>
      <button onClick={() => window.history.back()} style={{
        alignSelf: 'flex-start',
        marginBottom: 24,
        background: 'none',
        border: 'none',
        fontSize: 24,
        color: '#4e73df',
        cursor: 'pointer',
      }}>&larr; Voltar</button>
      <h2 style={{ marginBottom: 24 }}>{conteudo.titulo}</h2>
      {conteudo.imagem && (
        <img src={conteudo.imagem} alt={conteudo.titulo} style={{
          width: '100%',
          maxWidth: 500,
          maxHeight: 350,
          objectFit: 'cover',
          borderRadius: 8,
          marginBottom: 24,
        }} />
      )}
      <div style={{ fontSize: '1.1rem', color: '#333', textAlign: 'left', maxWidth: 600 }}>{conteudo.texto}</div>
    </div>
  );
};

export default ConteudoDetalhe; 
import React, { useState, useRef } from 'react';
import '../../styles/ConteudoForm.css';

const ConteudoForm = ({ conteudo, onSave, onCancel, conteudos }) => {
  const [formData, setFormData] = useState(
    conteudo || { id: null, titulo: '', texto: '', imagem: null }
  );
  const tituloRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Permite selecionar um conteúdo da lista para edição
  const handleSelectConteudo = (item) => {
    setFormData({
      id: item.id || null,
      titulo: item.titulo || '',
      texto: item.texto || '',
      imagem: item.imagem || ''
    });
    setTimeout(() => {
      if (tituloRef.current) {
        tituloRef.current.focus();
      }
    }, 0);
  };

  return (
    <div>
      <div className="conteudo-form-container">
        <form onSubmit={handleSubmit} className="conteudo-form">
          <h2>{formData.id ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}</h2>
          
          {/* Campo ID oculto */}
          <input type="hidden" name="id" value={formData.id || ''} />

          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Digite o título do conteúdo"
              ref={tituloRef}
            />
          </div>

          <div className="form-group">
            <label htmlFor="texto">Texto</label>
            <textarea
              id="texto"
              name="texto"
              value={formData.texto}
              onChange={handleChange}
              rows="5"
              placeholder="Digite o texto principal"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="imagem">URL da Imagem</label>
            <input
              type="text"
              id="imagem"
              name="imagem"
              value={formData.imagem || ''}
              onChange={handleChange}
              placeholder="Cole aqui a URL da imagem (opcional)"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {formData.id ? 'Atualizar Conteúdo' : 'Adicionar Conteúdo'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {/* Lista de conteúdos criados */}
      <div className="conteudos-lista" style={{ marginTop: '2rem' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Conteúdos já cadastrados</h3>
        {conteudos && conteudos.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {conteudos.map((item, idx) => (
              <li key={idx} style={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(44,62,80,0.07)',
                marginBottom: '1rem',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => handleSelectConteudo(item)}
              >
                {item.imagem && (
                  <img src={item.imagem} alt={item.titulo} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.titulo}</div>
                  <div style={{ color: '#555', fontSize: '0.95rem' }}>{item.texto}</div>
                  {item.imagem && (
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.imagem}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>Nenhum conteúdo cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default ConteudoForm; 
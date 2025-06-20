import React, { useState } from 'react';
import './ConteudoForm.css';

const ConteudoForm = ({ conteudo, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    conteudo || { id: null, titulo: '', texto: '', imagem: null }
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagem') {
      setFormData({ ...formData, imagem: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
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
          <label htmlFor="imagem">Imagem</label>
          <input
            type="file"
            id="imagem"
            name="imagem"
            onChange={handleChange}
            accept="image/*"
          />
          {typeof formData.imagem === 'string' && formData.imagem && (
            <div className="image-preview">
              <p>Imagem atual:</p>
              <img src={formData.imagem} alt="Pré-visualização" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {formData.id ? 'Salvar Alterações' : 'Adicionar Conteúdo'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConteudoForm; 
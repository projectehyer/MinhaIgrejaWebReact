import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import '../../styles/IgrejaForm.css';

const IgrejaForm = ({ igreja, onSave, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(
    igreja || { 
      id: null, 
      nome: '', 
      logradouro: '', 
      numero: '', 
      complemento: '', 
      bairro: '', 
      id_cidade: '', 
      id_uf: '' 
    }
  );
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const nomeRef = useRef(null);

  const fetchCidades = useCallback(async (idUf) => {
    setLoadingCidades(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_API_BASE_URL;
      const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;
      const res = await api.get(`${SUPABASE_URL}/rest/v1/municipios?id_estado=eq.${idUf}&select=*`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setCidades(res.data);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      setCidades([]);
    } finally {
      setLoadingCidades(false);
    }
  }, [token]);

  const fetchEstados = useCallback(async () => {
    setLoadingEstados(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_API_BASE_URL;
      const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;
      const res = await api.get(`${SUPABASE_URL}/rest/v1/estados?select=*`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setEstados(res.data);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      setEstados([]);
    } finally {
      setLoadingEstados(false);
    }
  }, [token]);

  // Carregar estados ao montar o componente
  useEffect(() => {
    fetchEstados();
  }, [fetchEstados]);

  // Buscar cidades do estado selecionado ao editar
  useEffect(() => {
    if (igreja && igreja.id_uf) {
      fetchCidades(igreja.id_uf);
    }
  }, [igreja, fetchCidades]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Se o estado foi alterado, limpar a cidade e carregar novas cidades
    if (name === 'id_uf') {
      setFormData(prev => ({ ...prev, [name]: value, id_cidade: '' }));
      if (value) {
        fetchCidades(value);
      } else {
        setCidades([]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="igreja-form-container">
        <form onSubmit={handleSubmit} className="igreja-form">
          <h2>{formData.id ? 'Editar Igreja' : 'Adicionar Nova Igreja'}</h2>
          
          {/* Campo ID oculto */}
          <input type="hidden" name="id" value={formData.id || ''} />

          <div className="form-group">
            <label htmlFor="nome">Nome da Igreja</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite o nome da igreja"
              ref={nomeRef}
            />
          </div>

          <div className="form-group">
            <label htmlFor="logradouro">Logradouro</label>
            <input
              type="text"
              id="logradouro"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              required
              placeholder="Digite o logradouro"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numero">Número</label>
              <input
                type="number"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                placeholder="Nº"
              />
            </div>

            <div className="form-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Apto, sala, etc."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              required
              placeholder="Digite o bairro"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_uf">Estado (UF)</label>
              <select
                id="id_uf"
                name="id_uf"
                value={formData.id_uf}
                onChange={handleChange}
                required
                disabled={loadingEstados}
              >
                <option value="">
                  {loadingEstados ? 'Carregando estados...' : 'Selecione o estado'}
                </option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome} ({estado.sigla})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="id_cidade">Cidade</label>
              <select
                id="id_cidade"
                name="id_cidade"
                value={formData.id_cidade}
                onChange={handleChange}
                required
                disabled={!formData.id_uf || loadingCidades}
              >
                <option value="">
                  {loadingCidades ? 'Carregando cidades...' : 
                   !formData.id_uf ? 'Selecione um estado primeiro' : 
                   'Selecione a cidade'}
                </option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {formData.id ? 'Atualizar Igreja' : 'Adicionar Igreja'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IgrejaForm; 

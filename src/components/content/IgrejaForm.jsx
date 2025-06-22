import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import '../../styles/IgrejaForm.css';

const IgrejaForm = ({ igreja, onSave, onCancel, igrejas }) => {
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

  // Função para buscar estados
  const fetchEstados = async () => {
    setLoadingEstados(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_API_BASE_URL;
      const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;
      
      const res = await api.get(`${SUPABASE_URL}/rest/v1/estados?select=*`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      });
      setEstados(res.data);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      setEstados([]);
    } finally {
      setLoadingEstados(false);
    }
  };

  // Carregar estados ao montar o componente
  useEffect(() => {
    fetchEstados();
  }, []);

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

  // Função para buscar cidades baseado no estado
  const fetchCidades = async (idUf) => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Permite selecionar uma igreja da lista para edição
  const handleSelectIgreja = (item) => {
    setFormData({
      id: item.id || null,
      nome: item.nome || '',
      logradouro: item.logradouro || '',
      numero: item.numero || '',
      complemento: item.complemento || '',
      bairro: item.bairro || '',
      id_cidade: item.id_cidade || '',
      id_uf: item.id_uf || ''
    });
    
    // Se há um estado selecionado, carregar as cidades
    if (item.id_uf) {
      fetchCidades(item.id_uf);
    }
    
    setTimeout(() => {
      if (nomeRef.current) {
        nomeRef.current.focus();
      }
    }, 0);
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
      
      {/* Lista de igrejas cadastradas */}
      <div className="igrejas-lista" style={{ marginTop: '2rem' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Igrejas já cadastradas</h3>
        {igrejas && igrejas.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {igrejas.map((item, idx) => (
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
              onClick={() => handleSelectIgreja(item)}
              >
                <div style={{ fontSize: '2rem' }}>⛪</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.nome}</div>
                  <div style={{ color: '#555', fontSize: '0.95rem' }}>
                    {item.logradouro}, {item.numero}
                    {item.complemento && ` - ${item.complemento}`}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {item.bairro} - {item.id_cidade}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>Nenhuma igreja cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
};

export default IgrejaForm; 

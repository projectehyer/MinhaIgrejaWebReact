import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import '../../styles/Dashboard.css'; // Importa o CSS
import ConteudoForm from '../content/ConteudoForm';
import ConteudoDetalhe from '../content/ConteudoDetalhe';
import IgrejaForm from '../content/IgrejaForm';
import Sidebar from '../layout/Sidebar';

// Adicione suas credenciais do Supabase aqui
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_API_BASE_URL;
const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;

const Dashboard = () => {
  const { userEmail, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [conteudos, setConteudos] = useState([]);
  const [igrejas, setIgrejas] = useState([]);
  const carrosselRef = useRef(null);
  const [editingConteudo, setEditingConteudo] = useState(null);
  const [editingIgreja, setEditingIgreja] = useState(null);
  const [idDetalhe, setIdDetalhe] = useState(null);
  const [showConteudoForm, setShowConteudoForm] = useState(false);
  const [showIgrejaForm, setShowIgrejaForm] = useState(false);
  const [conteudoFilter, setConteudoFilter] = useState('');
  const [igrejaFilter, setIgrejaFilter] = useState('');

  // Efeito para responsividade
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para buscar conteúdos
  const fetchConteudos = useCallback(async (filter = '') => {
    try {
      let url = `${SUPABASE_URL}/rest/v1/conteudo?select=id,titulo,texto,imagem`;
      if (filter) {
        url += `&titulo=ilike.*${encodeURIComponent(filter)}*`;
      }

      const res = await api.get(
        url,
        {
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setConteudos(res.data);
    } catch {
      setConteudos([]);
    }
  }, [token]);

  // Função para buscar igrejas
  const fetchIgrejas = useCallback(async (filter = '') => {
    try {
      let url = `${SUPABASE_URL}/rest/v1/igrejas?select=id,nome,logradouro,numero,complemento,bairro,id_cidade,id_uf`;
      if (filter) {
        url += `&nome=ilike.*${encodeURIComponent(filter)}`;
      }
      const res = await api.get(
        url,
        {
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIgrejas(res.data);
    } catch (error) {
      console.error('Erro ao buscar igrejas:', error);
      
      if (error.response?.status === 401) {
        console.log('Sessão expirada ao buscar igrejas');
        // Não fazer logout aqui, apenas limpar a lista
        setIgrejas([]);
      } else if (error.response?.status === 404) {
        console.log('Tabela de igrejas não encontrada');
        setIgrejas([]);
      } else {
        setIgrejas([]);
      }
    }
  }, [token]);

  // Efeito para buscar conteúdo
  useEffect(() => {
    if (activeMenu === 'inicio' || activeMenu === 'conteudos' || activeMenu === 'todos') {
      fetchConteudos();
    }
    if (activeMenu === 'igrejas') {
      fetchIgrejas();
    }
  }, [activeMenu, fetchConteudos, fetchIgrejas]);
  
  // Efeito para rolagem automática do carrossel
  useEffect(() => {
    if (!conteudos.length) return;
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    let interval = null;
    let isPaused = false;

    const scrollNext = () => {
      if (isPaused) return;
      const cards = carrossel.querySelectorAll('.conteudo-card');
      if (!cards.length) return;

      const firstCard = cards[0];
      const cardWidth = firstCard.offsetWidth;
      const currentScroll = carrossel.scrollLeft;
      const scrollWidth = carrossel.scrollWidth;
      const containerWidth = carrossel.offsetWidth;

      let nextScroll = currentScroll + cardWidth + 24;
      if (currentScroll + containerWidth >= scrollWidth - 50) {
        nextScroll = 0;
      }
      carrossel.scrollTo({ left: nextScroll, behavior: 'smooth' });
    };

    const startInterval = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(scrollNext, 5000);
    };

    const pauseRotation = () => {
      isPaused = true;
    };
    const resumeRotation = () => {
      isPaused = false;
    };

    // Pausa ao interagir, retoma ao sair/interação terminar
    carrossel.addEventListener('mousedown', pauseRotation);
    carrossel.addEventListener('touchstart', pauseRotation);
    carrossel.addEventListener('mouseover', pauseRotation);
    carrossel.addEventListener('mouseup', resumeRotation);
    carrossel.addEventListener('touchend', resumeRotation);
    carrossel.addEventListener('mouseleave', resumeRotation);

    startInterval();

    return () => {
      if (interval) clearInterval(interval);
      carrossel.removeEventListener('mousedown', pauseRotation);
      carrossel.removeEventListener('touchstart', pauseRotation);
      carrossel.removeEventListener('mouseover', pauseRotation);
      carrossel.removeEventListener('mouseup', resumeRotation);
      carrossel.removeEventListener('touchend', resumeRotation);
      carrossel.removeEventListener('mouseleave', resumeRotation);
    };
  }, [conteudos.length]);

  // Efeito para drag-scroll do carrossel
  useEffect(() => {
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    let isDragging = false;
    let startX;
    let startScrollLeft;

    const startDragging = (pageX) => {
      isDragging = true;
      startX = pageX - carrossel.offsetLeft;
      startScrollLeft = carrossel.scrollLeft;
    };

    const stopDragging = () => isDragging = false;

    const drag = (pageX) => {
      if (!isDragging) return;
      const x = pageX - carrossel.offsetLeft;
      const distance = (x - startX) * 1.5;
      carrossel.scrollLeft = startScrollLeft - distance;
    };

    const onMouseDown = (e) => { e.preventDefault(); startDragging(e.pageX); };
    const onMouseMove = (e) => { e.preventDefault(); drag(e.pageX); };
    const onTouchStart = (e) => startDragging(e.touches[0].pageX);
    const onTouchMove = (e) => drag(e.touches[0].pageX);

    carrossel.addEventListener('mousedown', onMouseDown);
    carrossel.addEventListener('mousemove', onMouseMove);
    carrossel.addEventListener('mouseup', stopDragging);
    carrossel.addEventListener('mouseleave', stopDragging);
    carrossel.addEventListener('touchstart', onTouchStart, { passive: true });
    carrossel.addEventListener('touchmove', onTouchMove, { passive: true });
    carrossel.addEventListener('touchend', stopDragging);

    return () => {
      // Cleanup
    };
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveConteudo = async (formData) => {
    try {
      let imageUrl = formData.imagem || null;
      const postData = {
        titulo: formData.titulo,
        texto: formData.texto,
        imagem: imageUrl,
      };
      if (formData.id) {
        // Atualização: PATCH
        await api.patch(
          `${SUPABASE_URL}/rest/v1/conteudo?id=eq.${formData.id}`,
          postData,
          {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
          }
        );
      } else {
        // Criação: POST
        await api.post(
          `${SUPABASE_URL}/rest/v1/conteudo`,
          postData,
          {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
          }
        );
      }
      
      console.log('Conteúdo salvo com sucesso!');
      await fetchConteudos();
      setActiveMenu('inicio');
      setEditingConteudo(null);
      setShowConteudoForm(false);

    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingConteudo(null);
    setShowConteudoForm(false);
  };

  const handleEditConteudo = (conteudo) => {
    setEditingConteudo(conteudo);
    setShowConteudoForm(true);
  };

  const handleAddNewConteudo = () => {
    setEditingConteudo(null);
    setShowConteudoForm(true);
  };

  const handleSaveIgreja = async (formData) => {
    try {
      const postData = {
        nome: formData.nome,
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento || null,
        bairro: formData.bairro,
        id_cidade: formData.id_cidade,
        id_uf: formData.id_uf,
      };
      
      if (formData.id) {
        // Atualização: PATCH
        await api.patch(
          `${SUPABASE_URL}/rest/v1/igrejas?id=eq.${formData.id}`,
          postData,
          {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
          }
        );
      } else {
        // Criação: POST
        await api.post(
          `${SUPABASE_URL}/rest/v1/igrejas`,
          postData,
          {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
          }
        );
      }
      
      console.log('Igreja salva com sucesso!');
      await fetchIgrejas();
      setActiveMenu('inicio');
      setEditingIgreja(null);
      setShowIgrejaForm(false);

    } catch (error) {
      console.error('Erro ao salvar igreja:', error);
      
      let errorMessage = 'Erro ao salvar igreja';
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
        // Redirecionar para login
        logout();
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Acesso negado. Verifique suas permissões.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Tabela de igrejas não encontrada. Verifique a configuração do Supabase.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      // Mostrar erro para o usuário (você pode implementar um toast ou alert)
      alert(errorMessage);
    }
  };

  const handleCancelEditIgreja = () => {
    setEditingIgreja(null);
    setShowIgrejaForm(false);
  };

  const handleAddNewIgreja = () => {
    setEditingIgreja(null);
    setShowIgrejaForm(true);
  };

  const handleEditIgreja = (igreja) => {
    setEditingIgreja(igreja);
    setShowIgrejaForm(true);
  };

  const handleAbrirDetalhe = (conteudo) => {
    setIdDetalhe(conteudo.id);
  };

  const handleFecharDetalhe = () => {
    setIdDetalhe(null);
  };

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    { 
      id: 'administracao', 
      label: 'Administração', 
      icon: '⚙️',
      submenu: [
        { id: 'conteudos', label: 'Conteúdos', icon: '📝' },
        { id: 'igrejas', label: 'Igrejas', icon: '⛪' },
        { id: 'membros', label: 'Membros', icon: '👥' },
        { id: 'eventos', label: 'Eventos', icon: '📅' },
        { id: 'ministerios', label: 'Ministérios', icon: '⛪' },
        { id: 'financeiro', label: 'Financeiro', icon: '💰' },
      ]
    },
    { id: 'configuracoes', label: 'Configurações', icon: '🔧' },
    { id: 'sair', label: 'Sair', icon: '🚪', isLogout: true }
  ];

  const renderContent = () => {
    if (idDetalhe) {
      return <ConteudoDetalhe id={idDetalhe} onClose={handleFecharDetalhe} embedded />;
    }
    switch(activeMenu) {
      case 'inicio':
        return (
          <div className="inicio-content">
            <h1 className="welcome-title">Bem-vindo ao painel de controle da sua igreja!</h1>
            <div className="carrossel-container">
              {conteudos.length > 0 ? (
                <div ref={carrosselRef} className="carrossel hide-scrollbar">
                  {conteudos.map((item, index) => (
                    <div key={index} className={`conteudo-card ${!item.imagem ? 'no-image' : ''}`}
                      onClick={() => handleAbrirDetalhe(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.imagem && (
                        <img src={item.imagem} alt={item.titulo} className="conteudo-imagem" />
                      )}
                      <div className="conteudo-info">
                        <h2 className="conteudo-titulo">{item.titulo}</h2>
                        <p className="conteudo-texto">{item.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p>Nenhum conteúdo disponível.</p>}
            </div>
            <button
              style={{
                display: 'block',
                margin: '2rem auto 0 auto',
                padding: '0.75rem 2rem',
                background: '#4e73df',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(78,115,223,0.10)'
              }}
              onClick={() => setActiveMenu('todos')}
            >
              Ver todos
            </button>
          </div>
        );
      case 'conteudos':
        if (showConteudoForm) {
          return (
            <ConteudoForm 
              conteudo={editingConteudo}
              onSave={handleSaveConteudo}
              onCancel={handleCancelEdit}
            />
          );
        }
        return (
          <div className="conteudo-lista-container">
            <h1 className="welcome-title">Gerenciar Conteúdos</h1>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Filtrar por título..."
                className="filter-input"
                value={conteudoFilter}
                onChange={(e) => setConteudoFilter(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchConteudos(conteudoFilter); }}
              />
              <button className="btn-filter" onClick={() => fetchConteudos(conteudoFilter)}>
                Filtrar
              </button>
              <button className="btn-clear-filter" onClick={() => {
                setConteudoFilter('');
                fetchConteudos('');
              }}>
                Limpar
              </button>
            </div>
            <button className="btn-add-new" onClick={handleAddNewConteudo}>
              Adicionar Novo Conteúdo
            </button>
            <div className="conteudo-lista">
              {conteudos.length > 0 ? (
                conteudos.map((item) => (
                  <div key={item.id} className="conteudo-lista-item">
                    <div className="conteudo-lista-info">
                      <h3>{item.titulo}</h3>
                      <p>{item.texto ? `${item.texto.substring(0, 100)}...` : '(Este conteúdo não possui texto.)'}</p>
                    </div>
                    <div className="conteudo-lista-actions">
                      <button onClick={() => handleEditConteudo(item)}>Editar</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum conteúdo cadastrado.</p>
              )}
            </div>
          </div>
        );
      case 'igrejas':
        if (showIgrejaForm) {
          return (
            <IgrejaForm 
              igreja={editingIgreja}
              onSave={handleSaveIgreja}
              onCancel={handleCancelEditIgreja}
            />
          );
        }
        return (
          <div className="igreja-lista-container">
            <h1 className="welcome-title">Gerenciar Igrejas</h1>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                className="filter-input"
                value={igrejaFilter}
                onChange={(e) => setIgrejaFilter(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchIgrejas(igrejaFilter); }}
              />
              <button className="btn-filter" onClick={() => fetchIgrejas(igrejaFilter)}>
                Filtrar
              </button>
              <button className="btn-clear-filter" onClick={() => {
                setIgrejaFilter('');
                fetchIgrejas('');
              }}>
                Limpar
              </button>
            </div>
            <button className="btn-add-new" onClick={handleAddNewIgreja}>
              Adicionar Nova Igreja
            </button>
            <div className="igreja-lista">
              {igrejas.length > 0 ? (
                igrejas.map((item) => (
                  <div key={item.id} className="igreja-lista-item">
                    <div className="igreja-lista-info">
                      <h3>{item.nome}</h3>
                      <p>{item.logradouro}, {item.numero} - {item.bairro}</p>
                    </div>
                    <div className="igreja-lista-actions">
                      <button onClick={() => handleEditIgreja(item)}>Editar</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhuma igreja cadastrada.</p>
              )}
            </div>
          </div>
        );
      case 'membros':
        return <div>Lista de membros da igreja</div>;
      case 'eventos':
        return <div>Próximos eventos e celebrações</div>;
      case 'financeiro':
        return <div>Relatórios financeiros e dízimos</div>;
      case 'ministerios':
        return <div>Ministérios e grupos de trabalho</div>;
      case 'configuracoes':
        return <div>Configurações do sistema</div>;
      case 'administracao':
        return (
          <div className="administracao-content">
            <h1 className="welcome-title">Administração</h1>
            <p>Selecione uma opção do submenu para gerenciar os diferentes aspectos da igreja.</p>
          </div>
        );
      case 'todos':
        return (
          <div className="todos-conteudos-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 className="welcome-title">Todos os Conteúdos</h1>
            <div className="todos-conteudos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {conteudos.length > 0 ? (
                conteudos.map((item, index) => (
                  <div key={index} className={`conteudo-card ${!item.imagem ? 'no-image' : ''}`}
                    onClick={() => handleAbrirDetalhe(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.imagem && (
                      <img src={item.imagem} alt={item.titulo} className="conteudo-imagem" />
                    )}
                    <div className="conteudo-info">
                      <h2 className="conteudo-titulo">{item.titulo}</h2>
                      <p className="conteudo-texto">{item.texto}</p>
                    </div>
                  </div>
                ))
              ) : <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Nenhum conteúdo disponível.</p>}
            </div>
          </div>
        );
      default:
        return <div>Selecione uma opção do menu</div>;
    }
  };

  return (
    <div className="dashboard">
      {isMobile && !isMobileMenuOpen && (
        <button 
          className="menu-toggle" 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Menu"
        >
          ☰
        </button>
      )}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userEmail={userEmail}
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
        isMobile={isMobile}
        setIdDetalhe={setIdDetalhe}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import api, { setupAxiosInterceptors } from './axios';
import './Dashboard.css'; // Importa o CSS
import ConteudoForm from './ConteudoForm'; // Importa o novo componente

// Adicione suas credenciais do Supabase aqui
const SUPABASE_URL = 'https://uutmdodovftdaipqavpf.supabase.co';
const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;

const Dashboard = () => {
  const { userEmail, logout, token, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [conteudos, setConteudos] = useState([]);
  const carrosselRef = useRef(null);
  const [editingConteudo, setEditingConteudo] = useState(null);

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

  // Efeito para buscar conteúdo
  useEffect(() => {
    if (activeMenu === 'inicio') {
      const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
      api.get('https://uutmdodovftdaipqavpf.supabase.co/rest/v1/conteudo?select=titulo,texto,imagem', {
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`
        },
      })
      .then(res => setConteudos(res.data))
      .catch(() => setConteudos([]));
    }
  }, [activeMenu, token]);
  
  // Efeito para interceptar erros de autenticação com Axios
  useEffect(() => {
    setupAxiosInterceptors({ refreshSession, logout, navigate });
  }, [refreshSession, logout, navigate]);

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

      // 1. Se uma nova imagem foi selecionada, faz o upload
      if (formData.imagem && typeof formData.imagem !== 'string') {
        const file = formData.imagem;
        const fileName = `${Date.now()}_${file.name}`;
        const uploadPath = `public/${fileName}`;

        // Faz o upload para o Supabase Storage usando a API REST
        await api.post(
          `${SUPABASE_URL}/storage/v1/object/${uploadPath}`,
          file,
          {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': file.type,
            },
          }
        );
        
        // Constrói a URL pública da imagem
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${uploadPath}`;
      }

      // 2. Prepara os dados para salvar na tabela 'conteudo'
      const postData = {
        titulo: formData.titulo,
        texto: formData.texto,
        imagem: imageUrl,
      };

      // 3. Salva os dados na tabela
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
      
      console.log('Conteúdo salvo com sucesso!');
      // Atualiza a lista de conteúdos (implementar) e volta para o início
      setActiveMenu('inicio');
      setEditingConteudo(null);

    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      // Adicionar feedback para o usuário (ex: toast de erro)
    }
  };

  const handleCancelEdit = () => {
    setActiveMenu('inicio');
    setEditingConteudo(null);
  };

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    { id: 'conteudos', label: 'Conteúdos', icon: '📝' }, // Nova opção de menu
    { id: 'membros', label: 'Membros', icon: '👥' },
    { id: 'eventos', label: 'Eventos', icon: '📅' },
    { id: 'financeiro', label: 'Financeiro', icon: '💰' },
    { id: 'ministerios', label: 'Ministérios', icon: '⛪' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
    { id: 'sair', label: 'Sair', icon: '🚪', isLogout: true }
  ];

  const renderContent = () => {
    switch(activeMenu) {
      case 'inicio':
        return (
          <div className="inicio-content">
            <h1 className="welcome-title">Bem-vindo ao painel de controle da sua igreja!</h1>
            <div className="carrossel-container">
              {conteudos.length > 0 ? (
                <div ref={carrosselRef} className="carrossel hide-scrollbar">
                  {conteudos.map((item, index) => (
                    <div key={index} className={`conteudo-card ${!item.imagem ? 'no-image' : ''}`}>
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
          </div>
        );
      case 'conteudos':
        return (
          <ConteudoForm 
            conteudo={editingConteudo}
            onSave={handleSaveConteudo}
            onCancel={handleCancelEdit}
          />
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
      default:
        return <div>Selecione uma opção do menu</div>;
    }
  };

  const MenuButton = ({ item }) => (
    <button 
      className={`menu-button ${activeMenu === item.id ? 'active' : ''}`}
      onClick={() => {
        if (item.isLogout) {
          handleLogout();
        } else {
          setActiveMenu(item.id);
          if (isMobile) setIsMobileMenuOpen(false);
        }
      }}
    >
      <span className="menu-icon">{item.icon}</span>
      <span className="menu-label">{item.label}</span>
    </button>
  );

  const Sidebar = () => (
    <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      {isMobile && (
        <button 
          className="menu-close" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Fechar Menu"
        >
          &times;
        </button>
      )}
      <div className="logo-container">
        <h1 className="logo">Minha Igreja</h1>
        {userEmail && <p className="user-email">{userEmail}</p>}
      </div>
      <nav className="menu-nav">
        {menuItems.map(item => (
          <MenuButton key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );

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
      <Sidebar />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
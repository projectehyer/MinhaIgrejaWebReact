import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Importa o CSS

const Dashboard = () => {
  const { userEmail, logout, token, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [conteudos, setConteudos] = useState([]);
  const carrosselRef = useRef(null);

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
      axios.get('https://uutmdodovftdaipqavpf.supabase.co/rest/v1/conteudo?select=titulo,texto,imagem', {
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
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshSession();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate, refreshSession]);

  // Efeito para rolagem automática do carrossel
  useEffect(() => {
    if (!conteudos.length) return;
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    const scrollNext = () => {
      const cards = carrossel.querySelectorAll('.conteudo-card');
      if (!cards.length) return;

      const firstCard = cards[0];
      const cardWidth = firstCard.offsetWidth;
      const currentScroll = carrossel.scrollLeft;
      const scrollWidth = carrossel.scrollWidth;
      const containerWidth = carrossel.offsetWidth;

      // Calcula a próxima posição de scroll
      let nextScroll = currentScroll + cardWidth + 24; // 24px é o gap entre cards

      // Se chegou ao final, volta para o início
      if (currentScroll + containerWidth >= scrollWidth - 50) {
        nextScroll = 0;
      }

      // Faz o scroll suave
      carrossel.scrollTo({
        left: nextScroll,
        behavior: 'smooth'
      });
    };

    // Inicia o intervalo de rotação
    const interval = setInterval(scrollNext, 5000); // Reduzido para 5 segundos

    // Pausa a rotação quando o usuário interage com o carrossel
    const pauseRotation = () => clearInterval(interval);
    const events = ['mousedown', 'touchstart', 'mouseover'];
    events.forEach(event => carrossel.addEventListener(event, pauseRotation));

    return () => {
      clearInterval(interval);
      events.forEach(event => carrossel.removeEventListener(event, pauseRotation));
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

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
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
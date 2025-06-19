import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { userEmail, logout, token, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [conteudos, setConteudos] = useState([]);
  const carrosselRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Configurar interceptor do Axios para tratar erros de autenticação
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Se o erro for 401 e ainda não tentamos renovar o token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Tenta renovar o token
            const newToken = await refreshSession();
            
            // Atualiza o token na requisição original e tenta novamente
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Se falhar em renovar, faz logout e redireciona
            logout();
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Limpar interceptor quando o componente for desmontado
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate, refreshSession]);

  // Rolagem automática do carrossel
  useEffect(() => {
    if (!conteudos.length) return;
    
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    const scrollNext = () => {
      const cardWidth = carrossel.children[0]?.offsetWidth || 300;
      const gap = isMobile ? 16 : 32;
      const totalWidth = cardWidth + gap;
      
      if (carrossel.scrollLeft + carrossel.offsetWidth >= carrossel.scrollWidth) {
        // Se estiver no final, volta para o início
        carrossel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Senão, avança um card
        carrossel.scrollTo({
          left: carrossel.scrollLeft + totalWidth,
          behavior: 'smooth'
        });
      }
    };

    const interval = setInterval(scrollNext, 10000);
    return () => clearInterval(interval);
  }, [conteudos.length, isMobile]);

  // Drag-scroll handlers
  useEffect(() => {
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    let isDragging = false;
    let startX;
    let startScrollLeft;

    function startDragging(pageX) {
      isDragging = true;
      carrossel.style.cursor = 'grabbing';
      startX = pageX - carrossel.offsetLeft;
      startScrollLeft = carrossel.scrollLeft;
    }

    function stopDragging() {
      isDragging = false;
      carrossel.style.cursor = 'grab';
    }

    function drag(pageX) {
      if (!isDragging) return;
      const x = pageX - carrossel.offsetLeft;
      const distance = (x - startX) * 1.5;
      carrossel.scrollLeft = startScrollLeft - distance;
    }

    // Mouse Events
    carrossel.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDragging(e.pageX);
    });

    carrossel.addEventListener('mousemove', (e) => {
      e.preventDefault();
      drag(e.pageX);
    });

    carrossel.addEventListener('mouseup', stopDragging);
    carrossel.addEventListener('mouseleave', stopDragging);

    // Touch Events
    carrossel.addEventListener('touchstart', (e) => {
      startDragging(e.touches[0].pageX);
    });

    carrossel.addEventListener('touchmove', (e) => {
      drag(e.touches[0].pageX);
    });

    carrossel.addEventListener('touchend', stopDragging);

    return () => {
      carrossel.removeEventListener('mousedown', startDragging);
      carrossel.removeEventListener('mousemove', drag);
      carrossel.removeEventListener('mouseup', stopDragging);
      carrossel.removeEventListener('mouseleave', stopDragging);
      carrossel.removeEventListener('touchstart', startDragging);
      carrossel.removeEventListener('touchmove', drag);
      carrossel.removeEventListener('touchend', stopDragging);
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
          <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#f5f6fa',
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '20px',
              boxSizing: 'border-box',
            }}>
              <div style={{
                width: '100%',
                background: 'white',
                borderRadius: '10px',
                padding: '20px 0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div
                  ref={carrosselRef}
                  className="hide-scrollbar"
                  style={{
                    width: isMobile ? '300px' : '996px',
                    display: 'flex',
                    gap: isMobile ? 16 : 32,
                    overflowX: 'auto',
                    cursor: 'grab',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory',
                    margin: '0 auto',
                    padding: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {conteudos.map((atual, idx) => (
                    <div 
                      key={atual.id || idx} 
                      style={{
                        width: 300,
                        height: 340,
                        flex: '0 0 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        background: '#f1f1f1',
                        borderRadius: 16,
                        padding: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        scrollSnapAlign: 'center',
                      }}
                    >
                      {atual.imagem ? (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          <img 
                            src={atual.imagem} 
                            alt={atual.titulo || 'Conteúdo'} 
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 16,
                            }} 
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          padding: '20px',
                          boxSizing: 'border-box',
                        }}>
                          <h3 style={{
                            margin: '0 0 16px 0',
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                          }}>{atual.titulo || 'Sem título'}</h3>
                          <p style={{
                            margin: 0,
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                          }}>{atual.texto || 'Sem texto'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ 
                  marginTop: '20px',
                  textAlign: 'center',
                  color: '#333',
                  padding: '0 20px',
                  boxSizing: 'border-box',
                }}>Bem-vindo ao painel de controle da sua igreja!</div>
              </div>
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
      key={item.id}
      onClick={() => {
        if (item.isLogout) {
          handleLogout();
        } else {
          setActiveMenu(item.id);
          if (isMobile) {
            setIsMobileMenuOpen(false);
          }
        }
      }}
      style={{
        width: item.isLogout ? '100%' : '100%',
        maxWidth: item.isLogout ? '180px' : 'none',
        padding: '12px',
        margin: '5px 0',
        backgroundColor: activeMenu === item.id ? '#34495e' : 'transparent',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s',
        fontWeight: item.isLogout ? 600 : 'normal',
        justifyContent: 'flex-start',
      }}
    >
      <span style={{ marginRight: '10px' }}>{item.icon}</span>
      {item.label}
    </button>
  );

  const Sidebar = () => (
    <div style={{
      width: isMobile ? '100%' : '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      position: isMobile ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      height: isMobile ? '100vh' : '100vh',
      zIndex: 1000,
      transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
      transition: 'transform 0.3s ease-in-out',
      boxSizing: 'border-box',
    }}>
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: '0', fontSize: '1.5rem' }}>Minha Igreja</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
            {userEmail}
          </p>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <nav style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {menuItems.map(item => (
            <MenuButton key={item.id} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Mobile Toggle */}
      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1001,
            background: '#2c3e50',
            border: 'none',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <div style={{
        flex: 1,
        padding: isMobile ? '60px 15px 15px' : '30px',
        backgroundColor: '#f5f6fa',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {renderContent()}
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
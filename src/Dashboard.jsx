import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch(activeMenu) {
      case 'inicio':
        return <div>Bem-vindo ao painel de controle da sua igreja!</div>;
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
        setActiveMenu(item.id);
        if (isMobile) {
          setIsMobileMenuOpen(false);
        }
      }}
      style={{
        width: '100%',
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
        transition: 'background-color 0.3s'
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
        <button 
          onClick={handleLogout}
          style={{
            padding: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
            width: '100%'
          }}
        >
          Sair
        </button>
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
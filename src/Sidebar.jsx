import React from 'react';
import './Sidebar.css';

const MenuButton = ({ item, activeMenu, onClick }) => (
    <button
        className={`menu-button ${activeMenu === item.id ? 'active' : ''}`}
        onClick={() => onClick(item)}
    >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-label">{item.label}</span>
    </button>
);

const Sidebar = ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    userEmail,
    menuItems,
    activeMenu,
    setActiveMenu,
    handleLogout,
    isMobile,
    setIdDetalhe,
}) => {
    const handleMenuClick = (item) => {
        setIdDetalhe(null);
        if (item.isLogout) {
            handleLogout();
        } else {
            setActiveMenu(item.id);
            if (isMobile) {
                setIsMobileMenuOpen(false);
            }
        }
    };

    return (
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
                    <MenuButton
                        key={item.id}
                        item={item}
                        activeMenu={activeMenu}
                        onClick={handleMenuClick}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar; 
import React, { useState } from 'react';
import '../../styles/Sidebar.css';

const MenuButton = ({ item, activeMenu, onClick, openSubmenu, setOpenSubmenu }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = openSubmenu === item.id;
    const isActive = activeMenu === item.id || (hasSubmenu && item.submenu.some(subItem => activeMenu === subItem.id));

    const handleClick = () => {
        if (hasSubmenu) {
            setOpenSubmenu(isSubmenuOpen ? null : item.id);
        } else {
            onClick(item);
        }
    };

    return (
        <div className="menu-item-container">
            <button
                className={`menu-button ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`}
                onClick={handleClick}
            >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {hasSubmenu && (
                    <span className={`submenu-arrow ${isSubmenuOpen ? 'open' : ''}`}>▼</span>
                )}
            </button>
            {hasSubmenu && isSubmenuOpen && (
                <div className="submenu">
                    {item.submenu.map(subItem => (
                        <button
                            key={subItem.id}
                            className={`submenu-button ${activeMenu === subItem.id ? 'active' : ''}`}
                            onClick={() => onClick(subItem)}
                        >
                            <span className="submenu-icon">{subItem.icon}</span>
                            <span className="submenu-label">{subItem.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

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
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const handleMenuClick = (item) => {
        setIdDetalhe(null);
        if (item.isLogout) {
            handleLogout();
        } else {
            setActiveMenu(item.id);
            if (isMobile) {
                setIsMobileMenuOpen(false);
                setOpenSubmenu(null);
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
                        openSubmenu={openSubmenu}
                        setOpenSubmenu={setOpenSubmenu}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar; 
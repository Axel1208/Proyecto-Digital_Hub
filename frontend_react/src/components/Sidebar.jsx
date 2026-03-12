import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/panel', icon: '📊', label: 'Panel' },
    { path: '/historial', icon: '📋', label: 'Historial' },
    { path: '/fichas', icon: '📁', label: 'Fichas' },
    { path: '/comentarios', icon: '💬', label: 'Comentarios' },
    { path: '/papelero', icon: '🗑️', label: 'Papelero' },
    { path: '/ajustes', icon: '⚙️', label: 'Ajustes' },
    { path: '/notificaciones', icon: '🔔', label: 'Notificaciones' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/img/logo.png" alt="DigitalHub" className="sidebar-logo" />
        <span className="sidebar-title">DigitalHub</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

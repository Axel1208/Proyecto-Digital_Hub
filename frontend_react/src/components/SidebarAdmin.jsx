import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconDashboard, IconMonitor, IconMessage, IconHistory, IconTrash, IconUser, IconSettings } from './Icons';
import './Sidebar.css';

const SidebarAdmin = () => {
  const location = useLocation();
  const nombre = localStorage.getItem('nombre') || 'Administrador';

  const menuItems = [
    { path: '/admin/inicio',       icon: <IconDashboard size={18} />, label: 'Inicio' },
    { path: '/admin/equipos',      icon: <IconMonitor size={18} />,   label: 'Equipos' },
    { path: '/admin/historial',    icon: <IconHistory size={18} />,   label: 'Historial' },
    { path: '/admin/papelera',     icon: <IconTrash size={18} />,     label: 'Papelera' },
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
      <div className="sidebar-footer">
        <div className="sidebar-user-icon"><IconUser size={20} /></div>
        <span className="sidebar-user-name">{nombre}</span>
        <Link to="/admin/ajustes" className="sidebar-settings-btn" title="Ajustes">
          <IconSettings size={16} />
        </Link>
      </div>
    </aside>
  );
};

export default SidebarAdmin;

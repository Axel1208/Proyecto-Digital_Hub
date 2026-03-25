import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
import { IconUser, IconMessage, IconMonitor, IconReport, IconBell } from '../../components/Icons';
import '../Inicio.css';
import './InicioAdmin.css';

const Inicio = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre') || 'Administrador';
  const [stats, setStats] = useState({ portatiles: 0, fichas: 0, reportes: 0, disponibles: 0 });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/portatil', { headers }).then(r => r.json()).catch(() => []),
      fetch('/ficha',    { headers }).then(r => r.json()).catch(() => []),
      fetch('/reportes', { headers }).then(r => r.json()).catch(() => []),
    ]).then(([portatiles, fichas, reportes]) => {
      setStats({
        portatiles:  Array.isArray(portatiles) ? portatiles.length : 0,
        fichas:      Array.isArray(fichas)     ? fichas.length     : 0,
        reportes:    Array.isArray(reportes)   ? reportes.length   : 0,
        disponibles: Array.isArray(portatiles) ? portatiles.filter(p => p.estado === 'disponible').length : 0,
      });
    });
  }, []);

  return (
    <div className="inicio-layout">
      <SidebarAdmin />
      <main className="inicio-main admin-main">

        <div className="inicio-header">
          <div>
            <div className="admin-badge"><span className="admin-badge-dot" />Panel Activo</div>
            <h1 className="inicio-title admin-title">Bienvenido, {nombre}</h1>
            <p className="admin-subtitle">Vista general del sistema DigitalHub.</p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="admin-hero">
          <div className="admin-hero-content">
            <span className="admin-hero-tag">Administrador</span>
            <h2 className="admin-hero-title">Control total<br />del sistema</h2>
            <p className="admin-hero-desc">Gestiona equipos, usuarios, fichas y reportes desde un solo panel.</p>
            <div className="admin-hero-btns">
              <button className="admin-btn-primary" onClick={() => navigate('/admin/equipos')}>Ver Equipos</button>
              <button className="admin-btn-outline" onClick={() => navigate('/admin/ajustes')}>Ajustes</button>
            </div>
          </div>
          <div className="admin-hero-orbs">
            <div className="admin-orb admin-orb-1" />
            <div className="admin-orb admin-orb-2" />
            <div className="admin-orb admin-orb-3" />
          </div>
        </div>

        <div className="inicio-stats-grid">
          <div className="inicio-card">
            <div className="admin-stat-icon" style={{background:'rgba(248,113,113,0.12)',color:'#f87171'}}>
              <IconUser size={20} />
            </div>
            <div className="inicio-card-title">Fichas</div>
            <ul className="inicio-card-list"><li>Grupos registrados</li><li>Aprendices activos</li></ul>
            <div className="inicio-card-value" style={{color:'#f87171'}}>{stats.fichas}</div>
          </div>
          <div className="inicio-card">
            <div className="admin-stat-icon" style={{background:'rgba(127,90,240,0.15)',color:'#c9a8ff'}}>
              <IconMonitor size={20} />
            </div>
            <div className="inicio-card-title">Equipos</div>
            <ul className="inicio-card-list"><li>Total en sistema</li><li>Disponibles: {stats.disponibles}</li></ul>
            <div className="inicio-card-value" style={{color:'#c9a8ff'}}>{stats.portatiles}</div>
          </div>
          <div className="inicio-card">
            <div className="admin-stat-icon" style={{background:'rgba(250,204,21,0.12)',color:'#facc15'}}>
              <IconReport size={20} />
            </div>
            <div className="inicio-card-title">Reportes</div>
            <ul className="inicio-card-list"><li>Incidencias totales</li><li>Requieren revision</li></ul>
            <div className="inicio-card-value" style={{color:'#facc15'}}>{stats.reportes}</div>
          </div>
        </div>

        <div className="inicio-bottom-grid">
          <div className="inicio-card-wide">
            <div className="inicio-card-title">Actividad Semanal</div>
            <ul className="inicio-card-list">
              <li>Movimientos de equipos</li>
              <li>Registros completados</li>
              <li>Reportes generados</li>
            </ul>
            <div className="inicio-chart">
              {[60, 40, 85, 100, 20, 70, 55].map((h, i) => (
                <div key={i} className="inicio-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="inicio-card-narrow">
            <div className="admin-stat-icon" style={{background:'rgba(224,64,251,0.12)',color:'#e040fb'}}>
              <IconMessage size={20} />
            </div>
            <div className="inicio-card-title">Centro de Mensajes</div>
            <ul className="inicio-card-list">
              <li>Alertas del sistema</li>
              <li>Notificaciones pendientes</li>
              <li>Actividad reciente</li>
            </ul>
            <div className="inicio-msg-icon"><IconMessage size={36} /></div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Inicio;

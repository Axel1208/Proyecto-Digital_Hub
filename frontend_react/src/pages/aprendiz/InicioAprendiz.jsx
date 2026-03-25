import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAprendiz from '../../components/SidebarAprendiz';
import { IconMonitor, IconReport, IconBell, IconUser } from '../../components/Icons';
import '../Inicio.css';
import './InicioAprendiz.css';

const InicioAprendiz = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre') || 'Aprendiz';
  const [stats, setStats] = useState({ portatiles: 0, disponibles: 0, asignados: 0 });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/portatil', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).catch(() => [])
      .then(data => {
        if (!Array.isArray(data)) return;
        setStats({
          portatiles: data.length,
          disponibles: data.filter(p => p.estado === 'disponible').length,
          asignados: data.filter(p => p.estado === 'asignado').length,
        });
      });
  }, []);

  return (
    <div className="inicio-layout">
      <SidebarAprendiz />
      <main className="inicio-main aprendiz-main">

        <div className="inicio-header">
          <div>
            <div className="aprendiz-badge">
              <span className="aprendiz-badge-dot" />
              Sesion activa
            </div>
            <h1 className="inicio-title aprendiz-title">Bienvenido Aprendiz</h1>
            <p className="aprendiz-subtitle">Hola, <span>{nombre}</span>. Consulta equipos y gestiona tus solicitudes.</p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="aprendiz-hero">
          <div className="aprendiz-hero-content">
            <span className="aprendiz-hero-tag">Panel de Aprendiz</span>
            <h2 className="aprendiz-hero-title">Gestiona tus equipos<br />desde un solo lugar</h2>
            <p className="aprendiz-hero-desc">Consulta disponibilidad, revisa estados y reporta incidencias con facilidad.</p>
            <div className="aprendiz-hero-btns">
              <button className="aprendiz-btn-primary" onClick={() => navigate('/aprendiz/equipos')}>Ver Equipos</button>
              <button className="aprendiz-btn-outline" onClick={() => navigate('/aprendiz/reportes')}>Mis Reportes</button>
            </div>
          </div>
          <div className="aprendiz-hero-orbs">
            <div className="aprendiz-orb aprendiz-orb-1" />
            <div className="aprendiz-orb aprendiz-orb-2" />
            <div className="aprendiz-orb aprendiz-orb-3" />
          </div>
        </div>

        <div className="inicio-stats-grid">
          <div className="inicio-card aprendiz-stat-card">
            <div className="aprendiz-stat-icon" style={{background:'rgba(127,90,240,0.15)',color:'#c9a8ff'}}>
              <IconMonitor size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Total Equipos</div>
              <ul className="inicio-card-list">
                <li>Portatiles en el sistema</li>
                <li>Actualizados en tiempo real</li>
              </ul>
            </div>
            <div className="inicio-card-value aprendiz-val-purple">{stats.portatiles}</div>
          </div>

          <div className="inicio-card aprendiz-stat-card">
            <div className="aprendiz-stat-icon" style={{background:'rgba(74,222,128,0.12)',color:'#4ade80'}}>
              <IconMonitor size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Disponibles</div>
              <ul className="inicio-card-list">
                <li>Listos para usar</li>
                <li>Sin asignar actualmente</li>
              </ul>
            </div>
            <div className="inicio-card-value aprendiz-val-green">{stats.disponibles}</div>
          </div>

          <div className="inicio-card aprendiz-stat-card">
            <div className="aprendiz-stat-icon" style={{background:'rgba(250,204,21,0.12)',color:'#facc15'}}>
              <IconReport size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Asignados</div>
              <ul className="inicio-card-list">
                <li>En uso actualmente</li>
                <li>Por aprendices</li>
              </ul>
            </div>
            <div className="inicio-card-value aprendiz-val-yellow">{stats.asignados}</div>
          </div>
        </div>

        <div className="inicio-bottom-grid">
          <div className="inicio-card-wide">
            <div className="inicio-card-title">Actividad del sistema</div>
            <ul className="inicio-card-list">
              <li>Equipos disponibles esta semana</li>
              <li>Movimientos registrados</li>
            </ul>
            <div className="inicio-chart">
              {[40, 70, 55, 90, 30, 65, 80].map((h, i) => (
                <div key={i} className="inicio-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="inicio-card-narrow aprendiz-profile-card">
            <div className="aprendiz-stat-icon" style={{background:'rgba(44,185,176,0.12)',color:'#2cb9b0'}}>
              <IconUser size={20} />
            </div>
            <div className="inicio-card-title">Mi Perfil</div>
            <ul className="inicio-card-list">
              <li>{nombre}</li>
              <li>Rol: Aprendiz</li>
              <li>Sesion activa</li>
            </ul>
            <button className="aprendiz-btn-outline" style={{marginTop:'auto',width:'100%'}} onClick={() => navigate('/aprendiz/ajustes')}>
              Ir a Ajustes
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default InicioAprendiz;

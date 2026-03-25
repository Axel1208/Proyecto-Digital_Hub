import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarInstructor from '../../components/SidebarInstructor';
import { IconUser, IconMonitor, IconBarChart, IconMessage, IconBell, IconReport } from '../../components/Icons';
import '../Inicio.css';
import './InicioInstructor.css';

const InicioInstructor = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre') || 'Instructor';
  const [stats, setStats] = useState({ portatiles: 0, fichas: 0, reportes: 0 });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/portatil', { headers }).then(r => r.json()).catch(() => []),
      fetch('/ficha',    { headers }).then(r => r.json()).catch(() => []),
      fetch('/reportes', { headers }).then(r => r.json()).catch(() => []),
    ]).then(([portatiles, fichas, reportes]) => {
      setStats({
        portatiles: Array.isArray(portatiles) ? portatiles.length : 0,
        fichas:     Array.isArray(fichas)     ? fichas.length     : 0,
        reportes:   Array.isArray(reportes)   ? reportes.length   : 0,
      });
    });
  }, []);

  return (
    <div className="inicio-layout">
      <SidebarInstructor />
      <main className="inicio-main inst-main">

        <div className="inicio-header">
          <div>
            <div className="inst-badge">
              <span className="inst-badge-dot" />
              Sesion activa
            </div>
            <h1 className="inicio-title inst-title">Bienvenido, {nombre}</h1>
            <p className="inst-subtitle">Panel de control del instructor. Gestiona equipos, fichas y reportes.</p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="inst-hero">
          <div className="inst-hero-content">
            <span className="inst-hero-tag">Panel Instructor</span>
            <h2 className="inst-hero-title">Administra tus recursos<br />en tiempo real</h2>
            <p className="inst-hero-desc">Controla equipos, fichas de formacion y reportes desde un solo lugar.</p>
            <div className="inst-hero-btns">
              <button className="inst-btn-primary" onClick={() => navigate('/instructor/equipos')}>Ver Equipos</button>
              <button className="inst-btn-outline" onClick={() => navigate('/instructor/reportes')}>Ver Reportes</button>
            </div>
          </div>
          <div className="inst-hero-orbs">
            <div className="inst-orb inst-orb-1" />
            <div className="inst-orb inst-orb-2" />
            <div className="inst-orb inst-orb-3" />
          </div>
        </div>

        <div className="inicio-stats-grid">
          <div className="inicio-card">
            <div className="inst-stat-icon" style={{background:'rgba(44,185,176,0.12)',color:'#2cb9b0'}}>
              <IconUser size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Fichas Inscritas</div>
              <ul className="inicio-card-list">
                <li>Aprendices registrados</li>
                <li>Control de asistencia</li>
              </ul>
            </div>
            <div className="inicio-card-value" style={{color:'#2cb9b0'}}>{stats.fichas}</div>
          </div>

          <div className="inicio-card">
            <div className="inst-stat-icon" style={{background:'rgba(127,90,240,0.15)',color:'#c9a8ff'}}>
              <IconMonitor size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Equipos en Sistema</div>
              <ul className="inicio-card-list">
                <li>Portatiles registrados</li>
                <li>Estado actualizado</li>
              </ul>
            </div>
            <div className="inicio-card-value" style={{color:'#c9a8ff'}}>{stats.portatiles}</div>
          </div>

          <div className="inicio-card">
            <div className="inst-stat-icon" style={{background:'rgba(250,204,21,0.12)',color:'#facc15'}}>
              <IconReport size={20} />
            </div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Reportes Totales</div>
              <ul className="inicio-card-list">
                <li>Incidencias registradas</li>
                <li>Pendientes de revision</li>
              </ul>
            </div>
            <div className="inicio-card-value" style={{color:'#facc15'}}>{stats.reportes}</div>
          </div>
        </div>

        <div className="inicio-bottom-grid">
          <div className="inicio-card-wide">
            <div className="inicio-card-title">Actividad Semanal</div>
            <ul className="inicio-card-list">
              <li>Flujo diario de equipos</li>
              <li>Registros completados</li>
              <li>Actividad del instructor</li>
            </ul>
            <div className="inicio-chart">
              {[60, 40, 85, 100, 20, 70, 55].map((h, i) => (
                <div key={i} className="inicio-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="inicio-card-narrow">
            <div className="inst-stat-icon" style={{background:'rgba(224,64,251,0.12)',color:'#e040fb'}}>
              <IconMessage size={20} />
            </div>
            <div className="inicio-card-title">Centro de Mensajes</div>
            <ul className="inicio-card-list">
              <li>Mensajes recientes</li>
              <li>Alertas del sistema</li>
              <li>Comentarios por revisar</li>
            </ul>
            <div className="inicio-msg-icon"><IconMessage size={36} /></div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default InicioInstructor;

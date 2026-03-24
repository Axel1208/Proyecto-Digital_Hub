import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarInstructor from '../../components/SidebarInstructor';
import { IconUser, IconMonitor, IconBarChart, IconMessage, IconBell } from '../../components/Icons';
import '../Inicio.css';

const InicioInstructor = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState({ portatiles: 0, fichas: 0, reportes: 0 });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/portatil', { headers }).then(r => r.json()).catch(() => []),
      fetch('/ficha', { headers }).then(r => r.json()).catch(() => []),
      fetch('/reportes', { headers }).then(r => r.json()).catch(() => []),
    ]).then(([portatiles, fichas, reportes]) => {
      setStats({
        portatiles: Array.isArray(portatiles) ? portatiles.length : 0,
        fichas: Array.isArray(fichas) ? fichas.length : 0,
        reportes: Array.isArray(reportes) ? reportes.length : 0,
      });
    });
  }, []);

  const barHeights = [60, 40, 85, 100, 20];

  return (
    <div className="inicio-layout">
      <SidebarInstructor />
      <main className="inicio-main">
        <div className="inicio-header">
          <h1 className="inicio-title">Panel del Instructor</h1>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="inicio-stats-grid">
          <div className="inicio-card">
            <div className="inicio-card-icon"><IconUser size={22} /></div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Fichas Inscritas</div>
              <ul className="inicio-card-list">
                <li>Aprendices registrados</li>
                <li>Estado actualizado</li>
                <li>Control de asistencia</li>
              </ul>
            </div>
            <div className="inicio-card-value">{stats.fichas}</div>
          </div>

          <div className="inicio-card">
            <div className="inicio-card-icon"><IconMonitor size={22} /></div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Equipos Asignados</div>
              <ul className="inicio-card-list">
                <li>Equipos entregados</li>
                <li>Estado por dispositivo</li>
                <li>Últimos movimientos</li>
              </ul>
            </div>
            <div className="inicio-card-value">{stats.portatiles}</div>
          </div>

          <div className="inicio-card">
            <div className="inicio-card-icon"><IconBarChart size={22} /></div>
            <div className="inicio-card-body">
              <div className="inicio-card-title">Registros Semanales</div>
              <ul className="inicio-card-list">
                <li>Préstamos realizados</li>
                <li>Devoluciones registradas</li>
                <li>Reportes generados</li>
              </ul>
            </div>
            <div className="inicio-card-value">{stats.reportes}</div>
          </div>
        </div>

        <div className="inicio-bottom-grid">
          <div className="inicio-card-wide">
            <div className="inicio-card-title">Actividad Semanal</div>
            <ul className="inicio-card-list">
              <li>Flujo diario de equipos</li>
              <li>Registros completos</li>
              <li>Actividad por instructor</li>
            </ul>
            <div className="inicio-chart">
              {barHeights.map((h, i) => (
                <div key={i} className="inicio-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="inicio-card-narrow">
            <div className="inicio-card-icon"><IconMessage size={22} /></div>
            <div className="inicio-card-title">Centro de Mensajes</div>
            <ul className="inicio-card-list">
              <li>Mensajes recientes</li>
              <li>Alertas del sistema</li>
              <li>Comentarios por revisar</li>
            </ul>
            <div className="inicio-msg-icon"><IconMessage size={40} /></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InicioInstructor;

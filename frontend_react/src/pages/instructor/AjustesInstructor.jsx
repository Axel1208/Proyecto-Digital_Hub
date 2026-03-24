import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarInstructor from '../../components/SidebarInstructor';
import { IconBell } from '../../components/Icons';
import '../EquipmentManagement.css';
import '../Ajustes.css';

const AjustesInstructor = () => {
  const navigate = useNavigate();
  const [idioma, setIdioma] = useState(localStorage.getItem('idioma') || 'es');
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'oscuro');
  const [notifSistema, setNotifSistema] = useState(localStorage.getItem('notif_sistema') !== 'false');
  const [notifReportes, setNotifReportes] = useState(localStorage.getItem('notif_reportes') !== 'false');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
  }, []);

  useEffect(() => { localStorage.setItem('idioma', idioma); }, [idioma]);

  useEffect(() => {
    localStorage.setItem('tema', tema);
    document.documentElement.setAttribute('data-theme', tema);
  }, [tema]);

  useEffect(() => { localStorage.setItem('notif_sistema', notifSistema); }, [notifSistema]);
  useEffect(() => { localStorage.setItem('notif_reportes', notifReportes); }, [notifReportes]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="equipment-layout">
      <SidebarInstructor />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Ajustes</h1>
            <p className="equipment-subtitle">Personaliza tu experiencia</p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="ajustes-section">
          <div className="ajustes-section-title">Apariencia</div>

          <div className="ajustes-row">
            <div>
              <div className="ajustes-row-label">Idioma</div>
              <div className="ajustes-row-desc">Idioma de la interfaz</div>
            </div>
            <select className="ajustes-select" value={idioma} onChange={e => setIdioma(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="ajustes-row">
            <div>
              <div className="ajustes-row-label">Tema</div>
              <div className="ajustes-row-desc">Modo claro u oscuro</div>
            </div>
            <select className="ajustes-select" value={tema} onChange={e => setTema(e.target.value)}>
              <option value="oscuro">Oscuro</option>
              <option value="claro">Claro</option>
            </select>
          </div>
        </div>

        <div className="ajustes-section">
          <div className="ajustes-section-title">Notificaciones</div>

          <div className="ajustes-row">
            <div>
              <div className="ajustes-row-label">Alertas del sistema</div>
              <div className="ajustes-row-desc">Recibir notificaciones del sistema</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={notifSistema} onChange={e => setNotifSistema(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="ajustes-row">
            <div>
              <div className="ajustes-row-label">Nuevos reportes</div>
              <div className="ajustes-row-desc">Notificar cuando lleguen reportes</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={notifReportes} onChange={e => setNotifReportes(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div className="ajustes-section">
          <div className="ajustes-section-title">Sesión</div>
          <button className="btn-logout" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </main>
    </div>
  );
};

export default AjustesInstructor;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconBell } from '../../components/Icons';
import SidebarAprendiz from '../../components/SidebarAprendiz';
import '../EquipmentManagement.css';

const FichasAprendiz = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/ficha', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setFichas(await res.json());
    } catch { setError('Error al cargar fichas'); }
    finally { setLoading(false); }
  };

  const handleUnirse = async (id) => {
    if (!confirm('Unirte a esta ficha?')) return;
    setError(''); setSuccessMsg('');
    try {
      const res = await fetch(`/ficha/${id}/unirse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || data.mensaje || 'Error al unirse'); return; }
      setSuccessMsg('Te uniste a la ficha correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
      cargar();
    } catch { setError('Error al conectar'); }
  };

  const estadoColor = (e) => ({ activa: '#4ade80', inactiva: '#f87171', cerrada: '#facc15' }[e] || '#c9a8ff');
  const filtrados = fichas.filter(f => !filtro || f.nombre?.toLowerCase().includes(filtro.toLowerCase()) || f.programa_formacion?.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="equipment-layout">
      <SidebarAprendiz />
      <main className="equipment-main">
        <div className="equipment-header">
          <div><h1 className="equipment-title">Fichas Disponibles</h1><p className="equipment-subtitle">Total: <span>{fichas.length}</span></p></div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{fichas.length}</div></div>
          <div className="stat-card"><div className="stat-label">Activas</div><div className="stat-value" style={{color:'#4ade80'}}>{fichas.filter(f => f.estado === 'activa').length}</div></div>
        </div>
        {successMsg && <div style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:'10px',padding:'12px 18px',marginBottom:'16px',color:'#4ade80',fontSize:'14px'}}>{successMsg}</div>}
        {error && <p className="table-error">{error}</p>}
        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por nombre o programa..." value={filtro} onChange={e => setFiltro(e.target.value)} />
          <button className="filter-clear" onClick={() => setFiltro('')}>Limpiar</button>
        </div>
        <div className="table-container">
          <table className="equipment-table">
            <thead><tr><th>Nombre</th><th>Programa</th><th>Jornada</th><th>Cupo</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{textAlign:'center',padding:'32px'}}>Cargando...</td></tr>
              : filtrados.length === 0 ? <tr><td colSpan="6" style={{textAlign:'center',padding:'32px',color:'var(--text-muted-dark)'}}>Sin fichas disponibles</td></tr>
              : filtrados.map(f => (
                <tr key={f.id_ficha}>
                  <td>{f.nombre}</td>
                  <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.programa_formacion}</td>
                  <td>{f.jornada}</td>
                  <td>{f.cupo_maximo}</td>
                  <td><span style={{color:estadoColor(f.estado),fontWeight:600,fontSize:'13px'}}>{f.estado}</span></td>
                  <td><div className="action-buttons">
                    <button className="action-btn view" onClick={() => setSeleccionado(f)}><IconEye size={16} /></button>
                    {f.estado === 'activa' && (
                      <button className="action-btn edit" style={{fontSize:'11px',padding:'4px 8px',borderRadius:'8px'}} onClick={() => handleUnirse(f.id_ficha)}>Unirse</button>
                    )}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {seleccionado && (
          <div className="modal-overlay" onClick={() => setSeleccionado(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Detalle de Ficha</h2>
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">Nombre</span><span className="detalle-valor">{seleccionado.nombre}</span></div>
                <div className="detalle-item"><span className="detalle-label">Programa</span><span className="detalle-valor">{seleccionado.programa_formacion}</span></div>
                <div className="detalle-item"><span className="detalle-label">Jornada</span><span className="detalle-valor">{seleccionado.jornada}</span></div>
                <div className="detalle-item"><span className="detalle-label">Cupo</span><span className="detalle-valor">{seleccionado.cupo_maximo}</span></div>
                <div className="detalle-item"><span className="detalle-label">Estado</span><span className="detalle-valor" style={{color:estadoColor(seleccionado.estado),fontWeight:600}}>{seleccionado.estado}</span></div>
              </div>
              <div className="modal-actions"><button className="btn-save" onClick={() => setSeleccionado(null)}>Cerrar</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FichasAprendiz;

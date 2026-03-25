import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconBell, IconClock, IconCheck } from '../../components/Icons';
import SidebarAprendiz from '../../components/SidebarAprendiz';
import '../EquipmentManagement.css';

const ESTADOS = ['pendiente', 'en_revision', 'resuelto'];

const estadoColor = (e) => ({
  pendiente:   '#facc15',
  en_revision: '#fb923c',
  resuelto:    '#4ade80',
}[e] || '#c9a8ff');

const estadoBadge = (e) => ({
  pendiente:   { bg: 'rgba(250,204,21,0.12)',  border: 'rgba(250,204,21,0.4)'  },
  en_revision: { bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.4)'  },
  resuelto:    { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.4)'  },
}[e] || { bg: 'rgba(201,168,255,0.12)', border: 'rgba(201,168,255,0.4)' });

const ReportesAprendiz = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    descripcion: '',
    estado_reporte: 'pendiente',
    fecha_reporte: new Date().toISOString().split('T')[0],
  });
  const [filtros, setFiltros] = useState({ buscar: '', estado: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/reportes', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setReportes(await res.json());
    } catch { setError('Error al cargar los reportes'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al registrar'); return; }
      setShowModal(false);
      setFormData({ descripcion: '', estado_reporte: 'pendiente', fecha_reporte: new Date().toISOString().split('T')[0] });
      setSuccessMsg('Reporte enviado correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
      cargar();
    } catch { setError('Error al conectar'); }
    finally { setSubmitting(false); }
  };

  const abrirVer = (r) => { setSeleccionado(r); setShowVerModal(true); };

  const filtrados = reportes.filter(r => {
    const b = filtros.buscar.toLowerCase();
    return (!b || r.descripcion?.toLowerCase().includes(b) || String(r.id_reporte).includes(b))
      && (!filtros.estado || r.estado_reporte === filtros.estado);
  });

  return (
    <div className="equipment-layout">
      <SidebarAprendiz />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Mis Reportes</h1>
            <p className="equipment-subtitle">Total: <span>{reportes.length}</span></p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{reportes.length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconClock size={24} /></div><div className="stat-label">Pendientes</div><div className="stat-value">{reportes.filter(r => r.estado_reporte === 'pendiente').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconCheck size={24} /></div><div className="stat-label">Resueltos</div><div className="stat-value">{reportes.filter(r => r.estado_reporte === 'resuelto').length}</div></div>
        </div>

        {successMsg && (
          <div style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:'10px',padding:'12px 18px',marginBottom:'16px',color:'#4ade80',fontSize:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {successMsg}
          </div>
        )}

        {error && <p className="table-error">{error}</p>}

        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por descripcion o ID..." value={filtros.buscar} onChange={e => setFiltros({...filtros, buscar: e.target.value})} />
          <select className="filter-input" value={filtros.estado} onChange={e => setFiltros({...filtros, estado: e.target.value})}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En revision</option>
            <option value="resuelto">Resuelto</option>
          </select>
          <button className="filter-clear" onClick={() => setFiltros({ buscar: '', estado: '' })}>Limpiar</button>
        </div>

        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr><th>ID</th><th>Descripcion</th><th>Estado</th><th>Fecha</th><th>Ver</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'var(--text-muted-dark)'}}>Cargando...</td></tr>
                : filtrados.length === 0
                  ? <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'var(--text-muted-dark)'}}>Sin resultados</td></tr>
                  : filtrados.map(r => (
                    <tr key={r.id_reporte}>
                      <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>#{r.id_reporte}</td>
                      <td style={{maxWidth:'260px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.descripcion}</td>
                      <td>
                        <span style={{
                          background: estadoBadge(r.estado_reporte).bg,
                          border: `1px solid ${estadoBadge(r.estado_reporte).border}`,
                          color: estadoColor(r.estado_reporte),
                          borderRadius:'50px', padding:'3px 12px', fontSize:'12px', fontWeight:600
                        }}>{r.estado_reporte}</span>
                      </td>
                      <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{r.fecha_reporte?.split('T')[0] || r.fecha_reporte}</td>
                      <td>
                        <button className="action-btn view" onClick={() => abrirVer(r)}><IconEye size={16} /></button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>
          + Nuevo Reporte
        </button>

        {/* MODAL CREAR */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content rp-modal" onClick={e => e.stopPropagation()}>
              <div className="rp-modal-header">
                <div className="rp-modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <h2 className="modal-title" style={{marginBottom:'2px'}}>Nuevo Reporte</h2>
                  <p style={{fontSize:'13px',color:'var(--text-muted-dark)'}}>Describe el problema o incidencia</p>
                </div>
                <button className="rp-close-btn" onClick={() => setShowModal(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {error && <p className="table-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Descripcion <span style={{color:'#f87171'}}>*</span></label>
                  <textarea
                    rows={4}
                    placeholder="Describe detalladamente el problema o incidencia..."
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    maxLength={255}
                    required
                    style={{borderRadius:'12px',resize:'vertical'}}
                  />
                  <div style={{textAlign:'right',fontSize:'11px',color:'var(--text-muted-dark)',marginTop:'4px'}}>
                    {formData.descripcion.length}/255
                  </div>
                </div>

                <div className="form-group">
                  <label>Fecha <span style={{color:'#f87171'}}>*</span></label>
                  <input type="date" value={formData.fecha_reporte} onChange={e => setFormData({...formData, fecha_reporte: e.target.value})} required />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL VER */}
        {showVerModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowVerModal(false)}>
            <div className="modal-content rp-modal" onClick={e => e.stopPropagation()}>
              <div className="rp-modal-header">
                <div className="rp-modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div>
                  <h2 className="modal-title" style={{marginBottom:'2px'}}>Detalle del Reporte</h2>
                  <p style={{fontSize:'13px',color:'var(--text-muted-dark)'}}>Reporte #{seleccionado.id_reporte}</p>
                </div>
                <button className="rp-close-btn" onClick={() => setShowVerModal(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="rp-detail-body">
                <div className="rp-detail-desc">
                  <div style={{fontSize:'12px',color:'var(--text-muted-dark)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>Descripcion</div>
                  <p style={{fontSize:'15px',color:'var(--text-dark)',lineHeight:'1.7'}}>{seleccionado.descripcion}</p>
                </div>

                <div className="rp-detail-meta">
                  <div className="rp-meta-item">
                    <span className="rp-meta-label">Estado</span>
                    <span style={{
                      background: estadoBadge(seleccionado.estado_reporte).bg,
                      border: `1px solid ${estadoBadge(seleccionado.estado_reporte).border}`,
                      color: estadoColor(seleccionado.estado_reporte),
                      borderRadius:'50px', padding:'4px 14px', fontSize:'13px', fontWeight:600
                    }}>{seleccionado.estado_reporte}</span>
                  </div>
                  <div className="rp-meta-item">
                    <span className="rp-meta-label">Fecha</span>
                    <span className="rp-meta-val">{seleccionado.fecha_reporte?.split('T')[0] || seleccionado.fecha_reporte}</span>
                  </div>
                  <div className="rp-meta-item">
                    <span className="rp-meta-label">ID</span>
                    <span className="rp-meta-val">#{seleccionado.id_reporte}</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={() => setShowVerModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesAprendiz;


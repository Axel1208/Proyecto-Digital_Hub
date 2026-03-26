import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconPencil, IconTrash, IconBell, IconClock, IconCheck } from '../../components/Icons';
import SidebarAprendiz from '../../components/SidebarAprendiz';
import '../EquipmentManagement.css';

const LS_REPORTES = 'reportes_local';
const getLocalR = () => { try { return JSON.parse(localStorage.getItem(LS_REPORTES)) || []; } catch { return []; } };
const saveLocalR = (data) => localStorage.setItem(LS_REPORTES, JSON.stringify(data));
const nextIdR = (list) => list.length ? Math.max(...list.map(r => r.id_reporte || 0)) + 1 : 1;

const estadoColor = (e) => ({ pendiente:'#facc15', en_revision:'#fb923c', resuelto:'#4ade80' }[e] || '#c9a8ff');
const estadoBadge = (e) => ({
  pendiente:   { bg:'rgba(250,204,21,0.12)',  border:'rgba(250,204,21,0.4)'  },
  en_revision: { bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.4)'  },
  resuelto:    { bg:'rgba(74,222,128,0.12)',  border:'rgba(74,222,128,0.4)'  },
}[e] || { bg:'rgba(201,168,255,0.12)', border:'rgba(201,168,255,0.4)' });

const ReportesAprendiz = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({ descripcion: '', fecha_reporte: new Date().toISOString().split('T')[0] });
  const [editData, setEditData] = useState({ descripcion: '', fecha_reporte: '' });
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
      const data = await res.json();
      if (Array.isArray(data)) {
        const local = getLocalR();
        const backendIds = data.map(r => r.id_reporte);
        const soloLocales = local.filter(r => !backendIds.includes(r.id_reporte));
        const merged = [...data, ...soloLocales];
        saveLocalR(merged);
        setReportes(merged);
      } else {
        setReportes(getLocalR());
      }
    } catch { setReportes(getLocalR()); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = { ...formData, estado_reporte: 'pendiente' };
    try {
      const res = await fetch('/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ descripcion: '', fecha_reporte: new Date().toISOString().split('T')[0] });
        setSuccessMsg('Reporte enviado correctamente');
        setTimeout(() => setSuccessMsg(''), 3000);
        cargar(); setSubmitting(false); return;
      }
    } catch {}
    const local = getLocalR();
    local.push({ ...payload, id_reporte: nextIdR(local) });
    saveLocalR(local); setReportes(local);
    setShowModal(false);
    setFormData({ descripcion: '', fecha_reporte: new Date().toISOString().split('T')[0] });
    setSuccessMsg('Reporte guardado localmente');
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...editData, estado_reporte: seleccionado.estado_reporte };
    try {
      const res = await fetch(`/reportes/${seleccionado.id_reporte}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setShowEditModal(false); cargar(); return; }
    } catch {}
    const local = getLocalR().map(r => r.id_reporte === seleccionado.id_reporte ? { ...r, ...editData } : r);
    saveLocalR(local); setReportes(local); setShowEditModal(false);
  };

  const handleEliminar = async (id) => {
    if (!confirm('Eliminar este reporte?')) return;
    try {
      const res = await fetch(`/reportes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { cargar(); return; }
    } catch {}
    const local = getLocalR().filter(r => r.id_reporte !== id);
    saveLocalR(local); setReportes(local);
  };

  const abrirVer = (r) => { setSeleccionado(r); setShowVerModal(true); };
  const abrirEditar = (r) => {
    setSeleccionado(r);
    setEditData({ descripcion: r.descripcion, fecha_reporte: r.fecha_reporte?.split('T')[0] || r.fecha_reporte });
    setShowEditModal(true);
  };

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
            <thead><tr><th>ID</th><th>Descripcion</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan="5" style={{textAlign:'center',padding:'40px'}}>Cargando...</td></tr>
                : filtrados.length === 0
                  ? <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'var(--text-muted-dark)'}}>Sin resultados</td></tr>
                  : filtrados.map(r => (
                    <tr key={r.id_reporte}>
                      <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>#{r.id_reporte}</td>
                      <td style={{maxWidth:'260px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.descripcion}</td>
                      <td>
                        <span style={{background:estadoBadge(r.estado_reporte).bg,border:`1px solid ${estadoBadge(r.estado_reporte).border}`,color:estadoColor(r.estado_reporte),borderRadius:'50px',padding:'3px 12px',fontSize:'12px',fontWeight:600}}>
                          {r.estado_reporte}
                        </span>
                      </td>
                      <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{r.fecha_reporte?.split('T')[0] || r.fecha_reporte}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" onClick={() => abrirVer(r)}><IconEye size={16} /></button>
                          <button className="action-btn edit" onClick={() => abrirEditar(r)}><IconPencil size={16} /></button>
                          <button className="action-btn delete" onClick={() => handleEliminar(r.id_reporte)}><IconTrash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>+ Nuevo Reporte</button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Nuevo Reporte</h2>
              <p style={{fontSize:'13px',color:'var(--text-muted-dark)',marginBottom:'16px'}}>El estado se asigna automaticamente como pendiente.</p>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Descripcion <span style={{color:'#f87171'}}>*</span></label>
                  <textarea rows={4} placeholder="Describe el problema o incidencia..." value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} maxLength={255} required style={{borderRadius:'12px',resize:'vertical'}} />
                  <div style={{textAlign:'right',fontSize:'11px',color:'var(--text-muted-dark)',marginTop:'4px'}}>{formData.descripcion.length}/255</div>
                </div>
                <div className="form-group">
                  <label>Fecha <span style={{color:'#f87171'}}>*</span></label>
                  <input type="date" value={formData.fecha_reporte} onChange={e => setFormData({...formData, fecha_reporte: e.target.value})} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar Reporte'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showVerModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowVerModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Detalle del Reporte</h2>
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">ID</span><span className="detalle-valor">#{seleccionado.id_reporte}</span></div>
                <div className="detalle-item"><span className="detalle-label">Descripcion</span><span className="detalle-valor">{seleccionado.descripcion}</span></div>
                <div className="detalle-item"><span className="detalle-label">Estado</span><span className="detalle-valor" style={{color:estadoColor(seleccionado.estado_reporte),fontWeight:600}}>{seleccionado.estado_reporte}</span></div>
                <div className="detalle-item"><span className="detalle-label">Fecha</span><span className="detalle-valor">{seleccionado.fecha_reporte?.split('T')[0] || seleccionado.fecha_reporte}</span></div>
              </div>
              <div className="modal-actions"><button className="btn-save" onClick={() => setShowVerModal(false)}>Cerrar</button></div>
            </div>
          </div>
        )}

        {showEditModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Editar Reporte</h2>
              <p style={{fontSize:'13px',color:'var(--text-muted-dark)',marginBottom:'16px'}}>Solo puedes editar la descripcion y la fecha.</p>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleEditar}>
                <div className="form-group">
                  <label>Descripcion</label>
                  <textarea rows={4} value={editData.descripcion} onChange={e => setEditData({...editData, descripcion: e.target.value})} required style={{borderRadius:'12px',resize:'vertical'}} maxLength={255} />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input type="date" value={editData.fecha_reporte} onChange={e => setEditData({...editData, fecha_reporte: e.target.value})} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesAprendiz;

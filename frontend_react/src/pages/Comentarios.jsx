import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconPencil, IconTrash, IconBell, IconClock, IconCheck } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import './EquipmentManagement.css';

const Comentarios = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '', estado_reporte: 'pendiente',
    fecha_reporte: new Date().toISOString().split('T')[0], archivo: 'sin archivo'
  });
  const [editData, setEditData] = useState({ descripcion: '', estado_reporte: 'pendiente', fecha_reporte: '', archivo: '' });

  const [filtros, setFiltros] = useState({ buscar: '', estado: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
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
    try {
      const res = await fetch('/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al registrar'); return; }
      setShowModal(false);
      setFormData({ descripcion: '', estado_reporte: 'pendiente', fecha_reporte: new Date().toISOString().split('T')[0], archivo: 'sin archivo' });
      setError('');
      cargarReportes();
    } catch { setError('Error al conectar con el servidor'); }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/reportes/${seleccionado.id_reporte}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al editar'); return; }
      setShowEditModal(false);
      setError('');
      cargarReportes();
    } catch { setError('Error al conectar con el servidor'); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este reporte?')) return;
    try {
      const res = await fetch(`/reportes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) cargarReportes();
    } catch { setError('Error al eliminar'); }
  };

  const abrirVer = (r) => { setSeleccionado(r); setShowVerModal(true); };
  const abrirEditar = (r) => {
    setSeleccionado(r);
    setEditData({ descripcion: r.descripcion, estado_reporte: r.estado_reporte, fecha_reporte: r.fecha_reporte?.split('T')[0] || r.fecha_reporte, archivo: r.archivo });
    setShowEditModal(true);
  };

  const estadoColor = (e) => ({ 'pendiente': '#facc15', 'en proceso': '#fb923c', 'resuelto': '#4ade80' }[e] || '#c9a8ff');

  const reportesFiltrados = reportes.filter(r => {
    const buscar = filtros.buscar.toLowerCase();
    return (
      (!buscar || r.descripcion.toLowerCase().includes(buscar) || String(r.id_reporte).includes(buscar)) &&
      (!filtros.estado || r.estado_reporte === filtros.estado)
    );
  });

  return (
    <div className="equipment-layout">
      <Sidebar />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Comentarios y Reportes</h1>
            <p className="equipment-subtitle">Total de reportes: <span>{reportes.length}</span></p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total Reportes</div><div className="stat-value">{reportes.length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconClock size={24} /></div><div className="stat-label">Pendientes</div><div className="stat-value">{reportes.filter(r => r.estado_reporte === 'pendiente').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconCheck size={24} /></div><div className="stat-label">Resueltos</div><div className="stat-value">{reportes.filter(r => r.estado_reporte === 'resuelto').length}</div></div>
        </div>

        {error && <p className="table-error">{error}</p>}

        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por descripción o ID..." value={filtros.buscar} onChange={(e) => setFiltros({...filtros, buscar: e.target.value})} />
          <select className="filter-input" value={filtros.estado} onChange={(e) => setFiltros({...filtros, estado: e.target.value})}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
          </select>
          <button className="filter-clear" onClick={() => setFiltros({ buscar: '', estado: '' })}>Limpiar</button>
        </div>

        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr><th>ID</th><th>Descripción</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign:'center',padding:'32px'}}>Cargando...</td></tr>
              ) : reportesFiltrados.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center',padding:'32px',color:'var(--text-muted-dark)'}}>No se encontraron resultados</td></tr>
              ) : reportesFiltrados.map((r) => (
                <tr key={r.id_reporte}>
                  <td>#{r.id_reporte}</td>
                  <td style={{maxWidth:'250px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.descripcion}</td>
                  <td><span style={{color:estadoColor(r.estado_reporte),fontWeight:600,fontSize:'13px'}}>{r.estado_reporte}</span></td>
                  <td>{r.fecha_reporte?.split('T')[0] || r.fecha_reporte}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => abrirVer(r)} title="Ver"><IconEye size={16} /></button>
                      <button className="action-btn edit" onClick={() => abrirEditar(r)} title="Editar"><IconPencil size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleEliminar(r.id_reporte)} title="Eliminar"><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>Añadir Reporte</button>

        {/* MODAL AÑADIR */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Añadir nuevo reporte</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} placeholder="Describe el problema o comentario" required />
                </div>
                <div className="form-group"><label>Estado</label>
                  <select value={formData.estado_reporte} onChange={(e) => setFormData({...formData, estado_reporte: e.target.value})}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </div>
                <div className="form-group"><label>Fecha</label>
                  <input type="date" value={formData.fecha_reporte} onChange={(e) => setFormData({...formData, fecha_reporte: e.target.value})} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL VER */}
        {showVerModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowVerModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Detalle del reporte</h2>
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">ID</span><span className="detalle-valor">#{seleccionado.id_reporte}</span></div>
                <div className="detalle-item"><span className="detalle-label">Descripción</span><span className="detalle-valor">{seleccionado.descripcion}</span></div>
                <div className="detalle-item"><span className="detalle-label">Estado</span>
                  <span className="detalle-valor" style={{color:estadoColor(seleccionado.estado_reporte),fontWeight:600}}>{seleccionado.estado_reporte}</span>
                </div>
                <div className="detalle-item"><span className="detalle-label">Fecha</span><span className="detalle-valor">{seleccionado.fecha_reporte?.split('T')[0] || seleccionado.fecha_reporte}</span></div>
                <div className="detalle-item"><span className="detalle-label">Archivo</span><span className="detalle-valor">{seleccionado.archivo}</span></div>
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={() => setShowVerModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR */}
        {showEditModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Editar reporte</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleEditar}>
                <div className="form-group"><label>Descripción</label>
                  <input type="text" value={editData.descripcion} onChange={(e) => setEditData({...editData, descripcion: e.target.value})} required />
                </div>
                <div className="form-group"><label>Estado</label>
                  <select value={editData.estado_reporte} onChange={(e) => setEditData({...editData, estado_reporte: e.target.value})}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </div>
                <div className="form-group"><label>Fecha</label>
                  <input type="date" value={editData.fecha_reporte} onChange={(e) => setEditData({...editData, fecha_reporte: e.target.value})} required />
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

export default Comentarios;

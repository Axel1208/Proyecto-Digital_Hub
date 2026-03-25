import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconPencil, IconTrash, IconBell, IconMonitor, IconBarChart } from '../../components/Icons';
import SidebarInstructor from '../../components/SidebarInstructor';
import '../EquipmentManagement.css';

const EquiposInstructor = () => {
  const navigate = useNavigate();
  const [portatiles, setPortatiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ num_serie: '', marca: '', modelo: '', estado: 'disponible' });
  const [editData, setEditData] = useState({ marca: '', modelo: '', estado: 'disponible' });
  const [filtros, setFiltros] = useState({ buscar: '', estado: '', marca: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/portatil', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setPortatiles(await res.json());
    } catch { setError('Error al cargar los portátiles'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/portatil', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al registrar'); return; }
      setShowModal(false); setFormData({ num_serie: '', marca: '', modelo: '', estado: 'disponible' }); setError(''); cargar();
    } catch { setError('Error al conectar'); }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/portatil/${seleccionado.id_portatil}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(editData) });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al editar'); return; }
      setShowEditModal(false); setError(''); cargar();
    } catch { setError('Error al conectar'); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este portátil?')) return;
    try {
      const res = await fetch(`/portatil/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) cargar();
    } catch { setError('Error al eliminar'); }
  };

  const abrirVer = (p) => { setSeleccionado(p); setShowVerModal(true); };
  const abrirEditar = (p) => { setSeleccionado(p); setEditData({ marca: p.marca, modelo: p.modelo, estado: p.estado }); setShowEditModal(true); };
  const estadoColor = (e) => ({ disponible: '#4ade80', asignado: '#facc15', 'dañado': '#f87171', 'en reparacion': '#fb923c' }[e] || '#c9a8ff');

  const filtrados = portatiles.filter(p => {
    const b = filtros.buscar.toLowerCase();
    return (!b || p.num_serie.toLowerCase().includes(b) || p.marca.toLowerCase().includes(b) || p.modelo.toLowerCase().includes(b))
      && (!filtros.estado || p.estado === filtros.estado)
      && (!filtros.marca || p.marca.toLowerCase().includes(filtros.marca.toLowerCase()));
  });

  return (
    <div className="equipment-layout">
      <SidebarInstructor />
      <main className="equipment-main">
        <div className="equipment-header">
          <div><h1 className="equipment-title">Gestión de equipos</h1><p className="equipment-subtitle">Total: <span>{portatiles.length}</span></p></div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{portatiles.length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconMonitor size={24} /></div><div className="stat-label">Disponibles</div><div className="stat-value">{portatiles.filter(p => p.estado === 'disponible').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconBarChart size={24} /></div><div className="stat-label">Asignados</div><div className="stat-value">{portatiles.filter(p => p.estado === 'asignado').length}</div></div>
        </div>
        {error && <p className="table-error">{error}</p>}
        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por serie, marca o modelo..." value={filtros.buscar} onChange={e => setFiltros({...filtros, buscar: e.target.value})} />
          <select className="filter-input" value={filtros.estado} onChange={e => setFiltros({...filtros, estado: e.target.value})}>
            <option value="">Todos los estados</option><option value="disponible">Disponible</option><option value="asignado">Asignado</option><option value="dañado">Dañado</option><option value="en reparacion">En reparación</option>
          </select>
          <input className="filter-input" placeholder="Filtrar por marca..." value={filtros.marca} onChange={e => setFiltros({...filtros, marca: e.target.value})} />
          <button className="filter-clear" onClick={() => setFiltros({ buscar: '', estado: '', marca: '' })}>Limpiar</button>
        </div>
        <div className="table-container">
          <table className="equipment-table">
            <thead><tr><th>N° Serie</th><th>Marca</th><th>Modelo</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" style={{textAlign:'center',padding:'32px'}}>Cargando...</td></tr>
              : filtrados.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center',padding:'32px',color:'var(--text-muted-dark)'}}>Sin resultados</td></tr>
              : filtrados.map(p => (
                <tr key={p.id_portatil}>
                  <td>{p.num_serie}</td><td>{p.marca}</td><td>{p.modelo}</td>
                  <td><span style={{color:estadoColor(p.estado),fontWeight:600,fontSize:'13px'}}>{p.estado}</span></td>
                  <td><div className="action-buttons">
                    <button className="action-btn view" onClick={() => abrirVer(p)}><IconEye size={16} /></button>
                    <button className="action-btn edit" onClick={() => abrirEditar(p)}><IconPencil size={16} /></button>
                    <button className="action-btn delete" onClick={() => handleEliminar(p.id_portatil)}><IconTrash size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>Añadir Portátil</button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Añadir portátil</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Número de serie</label><input type="text" value={formData.num_serie} onChange={e => setFormData({...formData, num_serie: e.target.value})} required /></div>
                <div className="form-group"><label>Marca</label><input type="text" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} required /></div>
                <div className="form-group"><label>Modelo</label><input type="text" value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} required /></div>
                <div className="form-group"><label>Estado</label>
                  <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                    <option value="disponible">Disponible</option><option value="asignado">Asignado</option><option value="dañado">Dañado</option><option value="en reparacion">En reparación</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showVerModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowVerModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Detalle del portátil</h2>
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">ID</span><span className="detalle-valor">#{seleccionado.id_portatil}</span></div>
                <div className="detalle-item"><span className="detalle-label">N° Serie</span><span className="detalle-valor">{seleccionado.num_serie}</span></div>
                <div className="detalle-item"><span className="detalle-label">Marca</span><span className="detalle-valor">{seleccionado.marca}</span></div>
                <div className="detalle-item"><span className="detalle-label">Modelo</span><span className="detalle-valor">{seleccionado.modelo}</span></div>
                <div className="detalle-item"><span className="detalle-label">Estado</span><span className="detalle-valor" style={{color:estadoColor(seleccionado.estado),fontWeight:600}}>{seleccionado.estado}</span></div>
              </div>
              <div className="modal-actions"><button className="btn-save" onClick={() => setShowVerModal(false)}>Cerrar</button></div>
            </div>
          </div>
        )}
        {showEditModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Editar portátil</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleEditar}>
                <div className="form-group"><label>Marca</label><input type="text" value={editData.marca} onChange={e => setEditData({...editData, marca: e.target.value})} required /></div>
                <div className="form-group"><label>Modelo</label><input type="text" value={editData.modelo} onChange={e => setEditData({...editData, modelo: e.target.value})} required /></div>
                <div className="form-group"><label>Estado</label>
                  <select value={editData.estado} onChange={e => setEditData({...editData, estado: e.target.value})}>
                    <option value="disponible">Disponible</option><option value="asignado">Asignado</option><option value="dañado">Dañado</option><option value="en reparacion">En reparación</option>
                  </select>
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

export default EquiposInstructor;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconPencil, IconTrash, IconBell, IconSun, IconMoon } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import './EquipmentManagement.css';

const Fichas = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);
  const [formData, setFormData] = useState({ id_ficha: '', programa_formacion: '', jornada: 'Mañana' });
  const [editData, setEditData] = useState({ programa_formacion: '', jornada: 'Mañana' });

  const [filtros, setFiltros] = useState({ buscar: '', jornada: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargarFichas();
  }, []);

  const cargarFichas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/ficha', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setFichas(await res.json());
    } catch { setError('Error al cargar las fichas'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/ficha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al registrar'); return; }
      setShowModal(false);
      setFormData({ id_ficha: '', programa_formacion: '', jornada: 'Mañana' });
      setError('');
      cargarFichas();
    } catch { setError('Error al conectar con el servidor'); }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/ficha/${seleccionada.id_ficha}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al editar'); return; }
      setShowEditModal(false);
      setError('');
      cargarFichas();
    } catch { setError('Error al conectar con el servidor'); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta ficha?')) return;
    try {
      const res = await fetch(`/ficha/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) cargarFichas();
    } catch { setError('Error al eliminar'); }
  };

  const abrirVer = (f) => { setSeleccionada(f); setShowVerModal(true); };
  const abrirEditar = (f) => {
    setSeleccionada(f);
    setEditData({ programa_formacion: f.programa_formacion, jornada: f.jornada });
    setShowEditModal(true);
  };

  const jornadaColor = (j) => ({ 'Mañana': '#4ade80', 'Tarde': '#facc15', 'Noche': '#c084fc' }[j] || '#c9a8ff');

  const fichasFiltradas = fichas.filter(f => {
    const buscar = filtros.buscar.toLowerCase();
    return (
      (!buscar || f.id_ficha.toLowerCase().includes(buscar) || f.programa_formacion.toLowerCase().includes(buscar)) &&
      (!filtros.jornada || f.jornada === filtros.jornada)
    );
  });

  return (
    <div className="equipment-layout">
      <Sidebar />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Gestión de Fichas</h1>
            <p className="equipment-subtitle">Total de fichas registradas: <span>{fichas.length}</span></p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total Fichas</div><div className="stat-value">{fichas.length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconSun size={24} /></div><div className="stat-label">Jornada Mañana</div><div className="stat-value">{fichas.filter(f => f.jornada === 'Mañana').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconMoon size={24} /></div><div className="stat-label">Jornada Noche</div><div className="stat-value">{fichas.filter(f => f.jornada === 'Noche').length}</div></div>
        </div>

        {error && <p className="table-error">{error}</p>}

        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por ID o programa..." value={filtros.buscar} onChange={(e) => setFiltros({...filtros, buscar: e.target.value})} />
          <select className="filter-input" value={filtros.jornada} onChange={(e) => setFiltros({...filtros, jornada: e.target.value})}>
            <option value="">Todas las jornadas</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
          <button className="filter-clear" onClick={() => setFiltros({ buscar: '', jornada: '' })}>Limpiar</button>
        </div>

        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr><th>ID Ficha</th><th>Programa de Formación</th><th>Jornada</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign:'center',padding:'32px'}}>Cargando...</td></tr>
              ) : fichasFiltradas.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center',padding:'32px',color:'var(--text-muted-dark)'}}>No se encontraron resultados</td></tr>
              ) : fichasFiltradas.map((f) => (
                <tr key={f.id_ficha}>
                  <td>{f.id_ficha}</td>
                  <td>{f.programa_formacion}</td>
                  <td><span style={{color:jornadaColor(f.jornada),fontWeight:600,fontSize:'13px'}}>{f.jornada}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => abrirVer(f)} title="Ver"><IconEye size={16} /></button>
                      <button className="action-btn edit" onClick={() => abrirEditar(f)} title="Editar"><IconPencil size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleEliminar(f.id_ficha)} title="Eliminar"><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>Añadir Ficha</button>

        {/* MODAL AÑADIR */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Añadir nueva ficha</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>ID Ficha</label>
                  <input type="text" value={formData.id_ficha} onChange={(e) => setFormData({...formData, id_ficha: e.target.value})} placeholder="Ej: 3146013" required />
                </div>
                <div className="form-group"><label>Programa de Formación</label>
                  <input type="text" value={formData.programa_formacion} onChange={(e) => setFormData({...formData, programa_formacion: e.target.value})} placeholder="Ej: Análisis y Desarrollo de Software" required />
                </div>
                <div className="form-group"><label>Jornada</label>
                  <select value={formData.jornada} onChange={(e) => setFormData({...formData, jornada: e.target.value})}>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
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

        {/* MODAL VER */}
        {showVerModal && seleccionada && (
          <div className="modal-overlay" onClick={() => setShowVerModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Detalle de la ficha</h2>
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">ID Ficha</span><span className="detalle-valor">{seleccionada.id_ficha}</span></div>
                <div className="detalle-item"><span className="detalle-label">Programa</span><span className="detalle-valor">{seleccionada.programa_formacion}</span></div>
                <div className="detalle-item"><span className="detalle-label">Jornada</span>
                  <span className="detalle-valor" style={{color:jornadaColor(seleccionada.jornada),fontWeight:600}}>{seleccionada.jornada}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={() => setShowVerModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR */}
        {showEditModal && seleccionada && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Editar ficha</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleEditar}>
                <div className="form-group"><label>Programa de Formación</label>
                  <input type="text" value={editData.programa_formacion} onChange={(e) => setEditData({...editData, programa_formacion: e.target.value})} required />
                </div>
                <div className="form-group"><label>Jornada</label>
                  <select value={editData.jornada} onChange={(e) => setEditData({...editData, jornada: e.target.value})}>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
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

export default Fichas;

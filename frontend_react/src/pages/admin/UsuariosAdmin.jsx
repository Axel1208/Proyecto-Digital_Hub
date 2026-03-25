import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconPencil, IconTrash, IconBell, IconUser } from '../../components/Icons';
import SidebarAdmin from '../../components/SidebarAdmin';
import '../EquipmentManagement.css';

const UsuariosAdmin = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', correo: '', password: '', rol: 'aprendiz', estado: 'activo' });
  const [editData, setEditData] = useState({ nombre: '', correo: '', rol: 'aprendiz', estado: 'activo' });
  const [filtro, setFiltro] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/usuarios', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setUsuarios(await res.json());
    } catch { setError('Error al cargar usuarios'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al crear'); return; }
      setShowModal(false); setFormData({ nombre: '', correo: '', password: '', rol: 'aprendiz', estado: 'activo' }); cargar();
    } catch { setError('Error al conectar'); }
  };

  const handleEditar = async (e) => {
    e.preventDefault(); setError('');
    try {
      const res = await fetch(`/api/usuarios/${seleccionado.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al editar'); return; }
      setShowEditModal(false); cargar();
    } catch { setError('Error al conectar'); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('Eliminar este usuario?')) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al eliminar'); return; }
      cargar();
    } catch { setError('Error al eliminar'); }
  };

  const rolColor = (r) => ({ administrador: '#c9a8ff', instructor: '#60a5fa', aprendiz: '#4ade80' }[r] || '#facc15');
  const filtrados = usuarios.filter(u => !filtro || u.nombre?.toLowerCase().includes(filtro.toLowerCase()) || u.correo?.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="equipment-layout">
      <SidebarAdmin />
      <main className="equipment-main">
        <div className="equipment-header">
          <div><h1 className="equipment-title">Gestion de Usuarios</h1><p className="equipment-subtitle">Total: <span>{usuarios.length}</span></p></div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{usuarios.length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconUser size={24} /></div><div className="stat-label">Admins</div><div className="stat-value">{usuarios.filter(u => u.rol === 'administrador').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconUser size={24} /></div><div className="stat-label">Instructores</div><div className="stat-value">{usuarios.filter(u => u.rol === 'instructor').length}</div></div>
          <div className="stat-card"><div className="stat-icon"><IconUser size={24} /></div><div className="stat-label">Aprendices</div><div className="stat-value">{usuarios.filter(u => u.rol === 'aprendiz').length}</div></div>
        </div>
        {error && <p className="table-error">{error}</p>}
        <div className="filters-row">
          <input className="filter-input" placeholder="Buscar por nombre o correo..." value={filtro} onChange={e => setFiltro(e.target.value)} />
          <button className="filter-clear" onClick={() => setFiltro('')}>Limpiar</button>
        </div>
        <div className="table-container">
          <table className="equipment-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" style={{textAlign:'center',padding:'32px'}}>Cargando...</td></tr>
              : filtrados.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center',padding:'32px',color:'var(--text-muted-dark)'}}>Sin resultados</td></tr>
              : filtrados.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.nombre}</td>
                  <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{u.correo}</td>
                  <td><span style={{color:rolColor(u.rol),fontWeight:600,fontSize:'13px'}}>{u.rol}</span></td>
                  <td><span style={{color: u.estado === 'activo' ? '#4ade80' : '#f87171',fontWeight:600,fontSize:'13px'}}>{u.estado}</span></td>
                  <td><div className="action-buttons">
                    <button className="action-btn edit" onClick={() => { setSeleccionado(u); setEditData({ nombre: u.nombre, correo: u.correo, rol: u.rol, estado: u.estado }); setShowEditModal(true); }}><IconPencil size={16} /></button>
                    <button className="action-btn delete" onClick={() => handleEliminar(u.id_usuario)}><IconTrash size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-add-equipment" onClick={() => { setError(''); setShowModal(true); }}>Anadir Usuario</button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Nuevo Usuario</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Nombre</label><input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required /></div>
                <div className="form-group"><label>Correo</label><input type="email" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} required /></div>
                <div className="form-group"><label>Contrasena</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
                <div className="form-group"><label>Rol</label>
                  <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                    <option value="aprendiz">Aprendiz</option>
                    <option value="instructor">Instructor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div className="form-group"><label>Estado</label>
                  <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                    <option value="activo">Activo</option>
                    <option value="inhabilitado">Inhabilitado</option>
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

        {showEditModal && seleccionado && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Editar Usuario</h2>
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleEditar}>
                <div className="form-group"><label>Nombre</label><input type="text" value={editData.nombre} onChange={e => setEditData({...editData, nombre: e.target.value})} required /></div>
                <div className="form-group"><label>Correo</label><input type="email" value={editData.correo} onChange={e => setEditData({...editData, correo: e.target.value})} required /></div>
                <div className="form-group"><label>Rol</label>
                  <select value={editData.rol} onChange={e => setEditData({...editData, rol: e.target.value})}>
                    <option value="aprendiz">Aprendiz</option>
                    <option value="instructor">Instructor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div className="form-group"><label>Estado</label>
                  <select value={editData.estado} onChange={e => setEditData({...editData, estado: e.target.value})}>
                    <option value="activo">Activo</option>
                    <option value="inhabilitado">Inhabilitado</option>
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

export default UsuariosAdmin;

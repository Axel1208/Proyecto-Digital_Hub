import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarInstructor from '../../components/SidebarInstructor';
import { IconBell, IconHistory, IconMonitor, IconCheck } from '../../components/Icons';
import '../EquipmentManagement.css';

const LS_KEY = 'portatiles_local';
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
import '../admin/HistorialAdmin.css';

const estadoColor = (e) => ({ disponible:'#4ade80', asignado:'#facc15', danado:'#f87171', mantenimiento:'#fb923c' }[e] || '#c9a8ff');

const HistorialInstructor = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [portatiles, setPortatiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/portatil', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.status === 401 ? navigate('/login') : r.json())
      .then(d => {
        if (Array.isArray(d)) {
          const local = getLocal();
          const backendIds = d.map(p => p.id_portatil);
          const soloLocales = local.filter(p => !backendIds.includes(p.id_portatil));
          setPortatiles([...d, ...soloLocales]);
        } else {
          setPortatiles(getLocal());
        }
      })
      .catch(() => setPortatiles(getLocal()))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = portatiles.filter(p =>
    !filtro || p.num_serie?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.marca?.toLowerCase().includes(filtro.toLowerCase())
  );

  const total      = portatiles.length;
  const disponibles = portatiles.filter(p => p.estado === 'disponible').length;
  const asignados   = portatiles.filter(p => p.estado === 'asignado').length;

  return (
    <div className="equipment-layout">
      <SidebarInstructor />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Historial de Equipos</h1>
            <p className="equipment-subtitle">Registro completo de todos los equipos en el sistema</p>
          </div>
          <button className="notification-btn"><IconBell size={20} /></button>
        </div>

        <div className="hist-summary">
          <div className="hist-summary-card">
            <div className="hist-summary-icon" style={{background:'rgba(127,90,240,0.15)',color:'#c9a8ff'}}><IconMonitor size={20}/></div>
            <div><div className="hist-summary-num">{total}</div><div className="hist-summary-label">Total registrados</div></div>
          </div>
          <div className="hist-summary-card">
            <div className="hist-summary-icon" style={{background:'rgba(74,222,128,0.12)',color:'#4ade80'}}><IconCheck size={20}/></div>
            <div><div className="hist-summary-num" style={{color:'#4ade80'}}>{disponibles}</div><div className="hist-summary-label">Disponibles</div></div>
          </div>
          <div className="hist-summary-card">
            <div className="hist-summary-icon" style={{background:'rgba(250,204,21,0.12)',color:'#facc15'}}><IconHistory size={20}/></div>
            <div><div className="hist-summary-num" style={{color:'#facc15'}}>{asignados}</div><div className="hist-summary-label">En uso</div></div>
          </div>
          <div className="hist-summary-card">
            <div className="hist-summary-icon" style={{background:'rgba(248,113,113,0.12)',color:'#f87171'}}><IconMonitor size={20}/></div>
            <div><div className="hist-summary-num" style={{color:'#f87171'}}>{portatiles.filter(p=>p.estado==='danado').length}</div><div className="hist-summary-label">Con fallas</div></div>
          </div>
        </div>

        <div className="hist-search-row">
          <input className="filter-input" placeholder="Buscar por serie o marca..." value={filtro} onChange={e => setFiltro(e.target.value)} style={{maxWidth:'360px'}} />
          <span className="hist-count">{filtrados.length} registros</span>
        </div>

        <div className="hist-timeline">
          {loading ? (
            <div className="hist-empty">Cargando historial...</div>
          ) : filtrados.length === 0 ? (
            <div className="hist-empty">Sin registros encontrados</div>
          ) : filtrados.map((p, i) => (
            <div key={p.id_portatil} className="hist-item">
              <div className="hist-dot" style={{background: estadoColor(p.estado), boxShadow: `0 0 8px ${estadoColor(p.estado)}`}} />
              <div className="hist-line" style={{opacity: i < filtrados.length - 1 ? 1 : 0}} />
              <div className="hist-card" onClick={() => setSeleccionado(p)}>
                <div className="hist-card-header">
                  <span className="hist-serial">{p.num_serie}</span>
                  <span className="hist-badge" style={{background:`${estadoColor(p.estado)}18`, border:`1px solid ${estadoColor(p.estado)}55`, color: estadoColor(p.estado)}}>
                    {p.estado}
                  </span>
                </div>
                <div className="hist-card-body">
                  <span>{p.marca} {p.modelo}</span>
                  <span className="hist-id">ID #{p.id_portatil}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HistorialInstructor;




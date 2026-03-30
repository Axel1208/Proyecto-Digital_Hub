import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconUser, IconMonitor, IconReport } from '../../components/Icons';
import SidebarAdmin from '../../components/SidebarAdmin';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import '../EquipmentManagement.css';
import './FichasAdmin.css';

const estadoColor = (e) => ({ activa:'#4ade80', inactiva:'#f87171', cerrada:'#facc15', disponible:'#4ade80', asignado:'#facc15', danado:'#f87171', mantenimiento:'#fb923c', pendiente:'#facc15', en_revision:'#fb923c', resuelto:'#4ade80' }[e] || '#c9a8ff');
const jornadaIcon = (j) => ({ manana:'🌅', tarde:'🌇', noche:'🌙', madrugada:'🌃' }[j] || '📅');

const FichasAdmin = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('lista');
  const [fichaActiva, setFichaActiva] = useState(null);
  const [tab, setTab] = useState('aprendices');
  const [aprendices, setAprendices] = useState([]);
  const [portatiles, setPortatiles] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;
  const token = localStorage.getItem('token');

  useEffect(() => { if (!token) { navigate('/login'); return; } cargar(); }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch('/ficha', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate('/login'); return; }
      setFichas(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  const cargarDetalle = async (ficha) => {
    setLoadingDetalle(true);
    const h = { Authorization: `Bearer ${token}` };
    const id = ficha.id_ficha;
    try {
      const [ra, rp, rr] = await Promise.all([
        fetch(`/ficha/${id}/aprendices`, { headers: h }).then(r => r.json()).catch(() => []),
        fetch(`/ficha/${id}/portatiles`, { headers: h }).then(r => r.json()).catch(() => []),
        fetch(`/ficha/${id}/reportes`,   { headers: h }).then(r => r.json()).catch(() => []),
      ]);
      setAprendices(Array.isArray(ra) ? ra : []);
      setPortatiles(Array.isArray(rp) ? rp : []);
      setReportes(Array.isArray(rr) ? rr : []);
    } catch {}
    finally { setLoadingDetalle(false); }
  };

  const abrirFicha = (f) => { setFichaActiva(f); setVista('detalle'); setTab('aprendices'); cargarDetalle(f); };

  const filtrados = fichas.filter(f => !filtro || f.nombre?.toLowerCase().includes(filtro.toLowerCase()) || f.programa_formacion?.toLowerCase().includes(filtro.toLowerCase()));
  const paginados = filtrados.slice((page-1)*PER_PAGE, page*PER_PAGE);

  // ===== DETALLE =====
  if (vista === 'detalle' && fichaActiva) {
    const pct = fichaActiva.cupo_maximo > 0 ? Math.round((aprendices.length / fichaActiva.cupo_maximo) * 100) : 0;
    return (
      <div className="equipment-layout">
        <SidebarAdmin />
        <main className="equipment-main">
          <div className="fd-header">
            <button onClick={() => setVista('lista')} className="fd-back-btn">← Volver</button>
            <div className="fd-header-info">
              <div className="fd-jornada-pill">{jornadaIcon(fichaActiva.jornada)} {fichaActiva.jornada}</div>
              <h1 className="fd-title">{fichaActiva.nombre}</h1>
              <p className="fd-subtitle">{fichaActiva.programa_formacion}</p>
            </div>
            <div className="fd-header-actions">
              <span className="fd-estado-pill" style={{background:`${estadoColor(fichaActiva.estado)}18`,border:`1px solid ${estadoColor(fichaActiva.estado)}44`,color:estadoColor(fichaActiva.estado)}}>{fichaActiva.estado}</span>
              <button className="notification-btn"><IconBell size={20}/></button>
            </div>
          </div>

          <div className="fd-bento">
            <div className="fd-widget fd-widget-cupo">
              <div className="fd-widget-label">Ocupacion</div>
              <div className="fd-cupo-ring-wrap">
                <svg viewBox="0 0 80 80" className="fd-ring-svg">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                  <circle cx="40" cy="40" r="32" fill="none"
                    stroke={pct >= 90 ? '#f87171' : pct >= 60 ? '#facc15' : '#4ade80'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*32}`}
                    strokeDashoffset={`${2*Math.PI*32*(1-pct/100)}`}
                    transform="rotate(-90 40 40)"
                    style={{transition:'stroke-dashoffset 0.6s ease'}}
                  />
                </svg>
                <div className="fd-ring-center">
                  <div className="fd-ring-pct" style={{color: pct >= 90 ? '#f87171' : pct >= 60 ? '#facc15' : '#4ade80'}}>{pct}%</div>
                  <div className="fd-ring-sub">{aprendices.length}/{fichaActiva.cupo_maximo}</div>
                </div>
              </div>
              <div className="fd-cupo-label">Cupo utilizado</div>
            </div>
            <div className="fd-widget fd-widget-apr" onClick={() => setTab('aprendices')}>
              <div className="fd-widget-icon-wrap" style={{background:'rgba(127,90,240,0.2)'}}><IconUser size={22} style={{color:'#c9a8ff'}}/></div>
              <div className="fd-widget-num" style={{color:'#c9a8ff'}}>{aprendices.length}</div>
              <div className="fd-widget-label">Aprendices</div>
              <div className="fd-widget-hint">Ver lista →</div>
            </div>
            <div className="fd-widget fd-widget-dev" onClick={() => setTab('dispositivos')}>
              <div className="fd-widget-icon-wrap" style={{background:'rgba(96,165,250,0.2)'}}><IconMonitor size={22} style={{color:'#60a5fa'}}/></div>
              <div className="fd-widget-num" style={{color:'#60a5fa'}}>{portatiles.length}</div>
              <div className="fd-widget-label">Dispositivos</div>
              <div className="fd-widget-hint">Ver lista →</div>
            </div>
            <div className="fd-widget fd-widget-rep" onClick={() => setTab('reportes')}>
              <div className="fd-widget-icon-wrap" style={{background:'rgba(251,146,60,0.2)'}}><IconReport size={22} style={{color:'#fb923c'}}/></div>
              <div className="fd-widget-num" style={{color:'#fb923c'}}>{reportes.length}</div>
              <div className="fd-widget-label">Reportes</div>
              <div className="fd-widget-hint">Ver lista →</div>
            </div>
          </div>

          <div className="fd-tabs-bar">
            <button className={`fd-tab ${tab==='aprendices'?'fd-tab-active':''}`} onClick={()=>setTab('aprendices')}><IconUser size={14}/> Aprendices <span className="fd-tab-badge" style={{background:'rgba(127,90,240,0.2)',color:'#c9a8ff'}}>{aprendices.length}</span></button>
            <button className={`fd-tab ${tab==='dispositivos'?'fd-tab-active':''}`} onClick={()=>setTab('dispositivos')}><IconMonitor size={14}/> Dispositivos <span className="fd-tab-badge" style={{background:'rgba(96,165,250,0.2)',color:'#60a5fa'}}>{portatiles.length}</span></button>
            <button className={`fd-tab ${tab==='reportes'?'fd-tab-active':''}`} onClick={()=>setTab('reportes')}><IconReport size={14}/> Reportes <span className="fd-tab-badge" style={{background:'rgba(251,146,60,0.2)',color:'#fb923c'}}>{reportes.length}</span></button>
          </div>

          {loadingDetalle ? (
            <div className="fd-loading">Cargando datos...</div>
          ) : (
            <div className="fd-table-wrap">
              {tab === 'aprendices' && (
                <table className="equipment-table">
                  <thead><tr><th>Nombre</th><th>Correo</th><th>Estado</th><th>Fecha union</th></tr></thead>
                  <tbody>
                    {aprendices.length === 0
                      ? <tr><td colSpan="4" className="fd-empty-row">Sin aprendices en esta ficha</td></tr>
                      : aprendices.map(a => (
                        <tr key={a.id_usuario}>
                          <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="fd-avatar" style={{background:'rgba(127,90,240,0.25)',color:'#c9a8ff'}}>{a.nombre?.[0]?.toUpperCase()}</div>{a.nombre}</div></td>
                          <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{a.correo}</td>
                          <td><span style={{color:estadoColor(a.estado),fontWeight:600,fontSize:'12px'}}>{a.estado}</span></td>
                          <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{a.fecha_union?.split('T')[0] || a.fecha_union}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'dispositivos' && (
                <table className="equipment-table">
                  <thead><tr><th>N Serie</th><th>Marca</th><th>Modelo</th><th>Estado</th></tr></thead>
                  <tbody>
                    {portatiles.length === 0
                      ? <tr><td colSpan="4" className="fd-empty-row">Sin dispositivos asignados</td></tr>
                      : portatiles.map(p => (
                        <tr key={p.id_portatil}>
                          <td style={{fontFamily:'monospace',fontSize:'13px'}}>{p.num_serie}</td>
                          <td>{p.marca}</td><td>{p.modelo}</td>
                          <td><span style={{color:estadoColor(p.estado),fontWeight:600,fontSize:'12px'}}>{p.estado}</span></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'reportes' && (
                <table className="equipment-table">
                  <thead><tr><th>Aprendiz</th><th>Descripcion</th><th>Estado</th><th>Fecha</th></tr></thead>
                  <tbody>
                    {reportes.length === 0
                      ? <tr><td colSpan="4" className="fd-empty-row">Sin reportes en esta ficha</td></tr>
                      : reportes.map(r => (
                        <tr key={r.id_reporte}>
                          <td>{r.aprendiz}</td>
                          <td style={{maxWidth:'260px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-muted-dark)',fontSize:'13px'}}>{r.descripcion}</td>
                          <td><span style={{color:estadoColor(r.estado_reporte),fontWeight:600,fontSize:'12px'}}>{r.estado_reporte}</span></td>
                          <td style={{color:'var(--text-muted-dark)',fontSize:'13px'}}>{r.fecha_reporte?.split('T')[0] || r.fecha_reporte}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ===== LISTA =====
  return (
    <div className="equipment-layout">
      <SidebarAdmin />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Fichas</h1>
            <p className="equipment-subtitle">Total: <span>{fichas.length}</span></p>
          </div>
          <button className="notification-btn"><IconBell size={20}/></button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IconUser size={20}/></div>
            <div className="stat-card-text"><div className="stat-value">{fichas.length}</div><div className="stat-label">Total</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IconUser size={20}/></div>
            <div className="stat-card-text"><div className="stat-value" style={{color:'#4ade80'}}>{fichas.filter(f=>f.estado==='activa').length}</div><div className="stat-label">Activas</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IconUser size={20}/></div>
            <div className="stat-card-text"><div className="stat-value" style={{color:'#f87171'}}>{fichas.filter(f=>f.estado!=='activa').length}</div><div className="stat-label">Inactivas</div></div>
          </div>
        </div>

        <div className="filters-row" style={{gridTemplateColumns:'1fr auto'}}>
          <input className="filter-input" placeholder="Buscar ficha..." value={filtro} onChange={e => setFiltro(e.target.value)}/>
          <button className="filter-clear" onClick={() => setFiltro('')}>Limpiar</button>
        </div>

        {loading ? <div style={{textAlign:'center',padding:'48px',color:'#b8a8d8'}}>Cargando...</div> : (
          <div className="fichas-grid">
            {paginados.length === 0
              ? <div style={{gridColumn:'1/-1',textAlign:'center',padding:'48px',color:'#b8a8d8'}}>Sin fichas</div>
              : paginados.map(f => (
                <div key={f.id_ficha} className="ficha-card" onClick={() => abrirFicha(f)}>
                  <div className="ficha-card-top">
                    <span className="ficha-jornada-badge">{jornadaIcon(f.jornada)} {f.jornada}</span>
                    <span style={{background:`${estadoColor(f.estado)}18`,border:`1px solid ${estadoColor(f.estado)}44`,color:estadoColor(f.estado),borderRadius:'50px',padding:'2px 10px',fontSize:'11px',fontWeight:600}}>{f.estado}</span>
                  </div>
                  <div className="ficha-card-nombre">{f.nombre}</div>
                  <div className="ficha-card-programa">{f.programa_formacion}</div>
                  <div className="ficha-card-footer">
                    <span><IconUser size={13}/> Cupo: {f.cupo_maximo}</span>
                    <span className="ficha-card-ver">Ver ficha →</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
        <Pagination page={page} total={filtrados.length} perPage={PER_PAGE} onChange={p => setPage(p)}/>
      </main>
    </div>
  );
};

export default FichasAdmin;

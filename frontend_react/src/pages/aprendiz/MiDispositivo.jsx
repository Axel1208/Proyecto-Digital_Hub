import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconMonitor, IconReport, IconCheck, IconUser } from '../../components/Icons';
import SidebarAprendiz from '../../components/SidebarAprendiz';
import '../EquipmentManagement.css';

const MiDispositivo = () => {
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);
  const [portatiles, setPortatiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ descripcion: '', fecha_reporte: new Date().toISOString().split('T')[0] });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const h = { Authorization: `Bearer ${token}` };
      const [fRes, pRes] = await Promise.all([
        fetch('/ficha/mia', { headers: h }),
        fetch('/portatil', { headers: h }),
      ]);
      const fData = fRes.ok ? await fRes.json() : null;
      const pData = await pRes.json();
      setFicha(fData);
      setPortatiles(Array.isArray(pData) ? pData.filter(p => p.estado === 'asignado') : []);
    } catch { setError('Error al cargar'); }
    finally { setLoading(false); }
  };

  const abrirReporte = (equipo) => {
    setEquipoSeleccionado(equipo);
    setFormData({ descripcion: '', fecha_reporte: new Date().toISOString().split('T')[0] });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      const res = await fetch('/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, estado_reporte: 'pendiente' }),
      });
      if (res.ok) {
        setShowModal(false);
        setSuccessMsg('Reporte enviado correctamente');
        setTimeout(() => setSuccessMsg(''), 3000);
        setSubmitting(false); return;
      }
    } catch {}
    setShowModal(false);
    setSuccessMsg('Reporte guardado');
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  return (
    <div className="equipment-layout">
      <SidebarAprendiz />
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Mi Dispositivo</h1>
            <p className="equipment-subtitle">Equipo asignado y reportes</p>
          </div>
          <button className="notification-btn"><IconBell size={20}/></button>
        </div>

        {successMsg && (
          <div style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:'10px',padding:'12px 18px',marginBottom:'20px',color:'#4ade80',fontSize:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
            <IconCheck size={16}/> {successMsg}
          </div>
        )}

        {/* FICHA */}
        {ficha && (
          <div style={{background:'linear-gradient(135deg,rgba(127,90,240,0.12),rgba(99,102,241,0.06))',border:'1px solid rgba(127,90,240,0.3)',borderRadius:'16px',padding:'18px 22px',marginBottom:'24px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(127,90,240,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#c9a8ff',flexShrink:0}}>
              <IconUser size={18}/>
            </div>
            <div>
              <div style={{fontSize:'11px',color:'#b8a8d8',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:'2px'}}>Ficha asignada</div>
              <div style={{fontSize:'15px',fontWeight:700,color:'#f0eaff'}}>{ficha.nombre}</div>
              <div style={{fontSize:'12px',color:'#b8a8d8'}}>{ficha.programa_formacion} · {ficha.jornada}</div>
            </div>
            <span style={{marginLeft:'auto',background:'rgba(74,222,128,0.12)',border:'1px solid rgba(74,222,128,0.3)',color:'#4ade80',borderRadius:'50px',padding:'3px 12px',fontSize:'11px',fontWeight:700}}>{ficha.estado}</span>
          </div>
        )}

        {/* DISPOSITIVOS */}
        <div style={{fontSize:'13px',fontWeight:700,color:'#b8a8d8',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:'14px'}}>
          Equipos asignados
        </div>

        {loading ? (
          <div style={{color:'#b8a8d8',fontSize:'13px',padding:'20px 0'}}>Cargando...</div>
        ) : portatiles.length === 0 ? (
          <div style={{background:'#1a0f35',border:'1px solid rgba(127,90,240,0.2)',borderRadius:'16px',padding:'24px',color:'#b8a8d8',fontSize:'13px',display:'flex',alignItems:'center',gap:'12px'}}>
            <IconMonitor size={20} style={{color:'rgba(201,168,255,0.3)'}}/> No tienes equipos asignados actualmente
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {portatiles.map(p => (
              <div key={p.id_portatil} style={{background:'linear-gradient(135deg,#2d1a55 0%,#1a0f35 100%)',border:'1px solid rgba(127,90,240,0.35)',borderRadius:'18px',display:'flex',overflow:'hidden'}}>
                <div style={{width:'5px',background:'linear-gradient(180deg,#7f5af0,#c9a8ff)',flexShrink:0}}/>
                <div style={{padding:'18px 20px',display:'flex',alignItems:'center',justifyContent:'center',borderRight:'1px dashed rgba(127,90,240,0.2)',flexShrink:0}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'rgba(127,90,240,0.18)',display:'flex',alignItems:'center',justifyContent:'center',color:'#c9a8ff'}}>
                    <IconMonitor size={26}/>
                  </div>
                </div>
                <div style={{flex:1,padding:'18px 22px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'6px'}}>
                  <div style={{fontSize:'17px',fontWeight:800,color:'#f0eaff'}}>{p.marca} {p.modelo}</div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'12px',color:'#b8a8d8'}}>Serie: <span style={{color:'#f0eaff',fontFamily:'monospace'}}>{p.num_serie}</span></span>
                    {p.tipo && <span style={{fontSize:'12px',color:'#b8a8d8'}}>Tipo: <span style={{color:'#f0eaff'}}>{p.tipo}</span></span>}
                  </div>
                  <span style={{fontSize:'11px',color:'#facc15',fontWeight:600,background:'rgba(250,204,21,0.1)',border:'1px solid rgba(250,204,21,0.25)',borderRadius:'50px',padding:'2px 10px',display:'inline-block',width:'fit-content'}}>{p.estado}</span>
                </div>
                <div style={{padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'center',borderLeft:'1px dashed rgba(127,90,240,0.2)',flexShrink:0}}>
                  <button onClick={() => abrirReporte(p)} style={{background:'linear-gradient(135deg,#7f5af0,#5a3bc0)',border:'none',borderRadius:'12px',padding:'12px 20px',color:'#fff',fontSize:'13px',fontWeight:700,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',boxShadow:'0 4px 16px rgba(127,90,240,0.4)',minWidth:'90px'}}>
                    <IconReport size={18}/>
                    <span>Reportar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Nuevo Reporte</h2>
              {equipoSeleccionado && (
                <div style={{background:'rgba(127,90,240,0.1)',border:'1px solid rgba(127,90,240,0.25)',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'10px'}}>
                  <IconMonitor size={16} style={{color:'#c9a8ff',flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#f0eaff'}}>{equipoSeleccionado.marca} {equipoSeleccionado.modelo}</div>
                    <div style={{fontSize:'11px',color:'#b8a8d8',fontFamily:'monospace'}}>{equipoSeleccionado.num_serie}</div>
                  </div>
                </div>
              )}
              {error && <p className="table-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Descripcion del problema <span style={{color:'#f87171'}}>*</span></label>
                  <textarea rows={4} placeholder="Describe el problema..." value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} maxLength={255} required style={{borderRadius:'12px',resize:'vertical'}}/>
                  <div style={{textAlign:'right',fontSize:'11px',color:'#b8a8d8',marginTop:'4px'}}>{formData.descripcion.length}/255</div>
                </div>
                <div className="form-group">
                  <label>Fecha <span style={{color:'#f87171'}}>*</span></label>
                  <input type="date" value={formData.fecha_reporte} onChange={e => setFormData({...formData, fecha_reporte: e.target.value})} required/>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar Reporte'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default MiDispositivo;

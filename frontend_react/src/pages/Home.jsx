import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const FeatureIcon = ({ children }) => (
  <div className="feature-icon">{children}</div>
);

const Home = () => {
  return (
    <div className="home-wrapper">
      <Navbar />

      {/* ===== HERO ===== */}
      <section id="inicio" className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Sistema de gestión tecnológica
            </div>
            <h1 className="hero-title">
              Gestiona tus equipos con <span>DigitalHub</span>
            </h1>
            <p className="hero-desc">
              Plataforma web diseñada para el control, asignación y seguimiento de
              portátiles en ambientes formativos. Centraliza la información y mantén
              trazabilidad total de tus recursos tecnológicos.
            </p>
            <div className="hero-buttons">
              <Link to="/registrarse" className="btn-primary">Únete ahora</Link>
              <a href="#quienes-somos" className="btn-outline">Conocer más</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'480px'}}>
                <defs>
                  <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a0a3a"/>
                    <stop offset="100%" stopColor="#0a0a1a"/>
                  </linearGradient>
                  <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7f5af0"/>
                    <stop offset="100%" stopColor="#4a2fa0"/>
                  </linearGradient>
                  <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2cb9b0"/>
                    <stop offset="100%" stopColor="#1a7a76"/>
                  </linearGradient>
                  <linearGradient id="bar3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e040fb"/>
                    <stop offset="100%" stopColor="#9c1ab1"/>
                  </linearGradient>
                  <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <rect width="500" height="400" fill="url(#bg1)" rx="20"/>
                {[0,1,2,3,4,5].map(i => (
                  <line key={`h${i}`} x1="0" y1={i*80} x2="500" y2={i*80} stroke="rgba(127,90,240,0.08)" strokeWidth="1"/>
                ))}
                {[0,1,2,3,4,5,6].map(i => (
                  <line key={`v${i}`} x1={i*83} y1="0" x2={i*83} y2="400" stroke="rgba(127,90,240,0.08)" strokeWidth="1"/>
                ))}
                {/* Monitor frame */}
                <rect x="100" y="55" width="300" height="205" rx="12" fill="rgba(127,90,240,0.12)" stroke="#7f5af0" strokeWidth="1.5"/>
                <rect x="112" y="67" width="276" height="181" rx="8" fill="rgba(8,8,18,0.95)"/>
                {/* Header bar */}
                <rect x="112" y="67" width="276" height="22" rx="8" fill="rgba(127,90,240,0.2)"/>
                <circle cx="126" cy="78" r="4" fill="#f87171"/>
                <circle cx="140" cy="78" r="4" fill="#facc15"/>
                <circle cx="154" cy="78" r="4" fill="#4ade80"/>
                <rect x="170" y="73" width="80" height="8" rx="4" fill="rgba(201,168,255,0.3)"/>
                {/* Bar chart - colores variados */}
                <rect x="128" y="185" width="18" height="45" rx="3" fill="url(#bar1)"/>
                <rect x="152" y="165" width="18" height="65" rx="3" fill="url(#bar2)"/>
                <rect x="176" y="150" width="18" height="80" rx="3" fill="url(#bar3)"/>
                <rect x="200" y="170" width="18" height="60" rx="3" fill="url(#bar1)" opacity="0.7"/>
                <rect x="224" y="155" width="18" height="75" rx="3" fill="url(#bar2)" opacity="0.8"/>
                {/* Line chart cian */}
                <polyline points="268,210 290,182 315,192 340,168 368,175" fill="none" stroke="#2cb9b0" strokeWidth="2.5" filter="url(#glow)"/>
                <circle cx="268" cy="210" r="4" fill="#2cb9b0" filter="url(#glow)"/>
                <circle cx="315" cy="192" r="4" fill="#2cb9b0" filter="url(#glow)"/>
                <circle cx="368" cy="175" r="4" fill="#2cb9b0" filter="url(#glow)"/>
                {/* Area bajo la línea */}
                <polygon points="268,210 290,182 315,192 340,168 368,175 368,230 268,230" fill="rgba(44,185,176,0.08)"/>
                {/* Monitor stand */}
                <rect x="232" y="260" width="36" height="14" rx="4" fill="rgba(127,90,240,0.35)"/>
                <rect x="212" y="272" width="76" height="7" rx="4" fill="rgba(127,90,240,0.25)"/>
                {/* Card izquierda - verde */}
                <rect x="22" y="95" width="92" height="58" rx="10" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.4)" strokeWidth="1"/>
                <circle cx="42" cy="114" r="8" fill="rgba(74,222,128,0.5)"/>
                <rect x="56" y="109" width="46" height="6" rx="3" fill="rgba(74,222,128,0.5)"/>
                <rect x="56" y="119" width="32" height="4" rx="2" fill="rgba(74,222,128,0.3)"/>
                <rect x="30" y="136" width="66" height="9" rx="5" fill="rgba(74,222,128,0.25)"/>
                {/* Card derecha - magenta */}
                <rect x="386" y="130" width="92" height="58" rx="10" fill="rgba(224,64,251,0.08)" stroke="rgba(224,64,251,0.4)" strokeWidth="1"/>
                <circle cx="406" cy="149" r="8" fill="rgba(224,64,251,0.5)"/>
                <rect x="420" y="144" width="46" height="6" rx="3" fill="rgba(224,64,251,0.5)"/>
                <rect x="420" y="154" width="32" height="4" rx="2" fill="rgba(224,64,251,0.3)"/>
                <rect x="394" y="170" width="66" height="9" rx="5" fill="rgba(224,64,251,0.25)"/>
                {/* Card abajo - cian */}
                <rect x="150" y="305" width="200" height="50" rx="10" fill="rgba(44,185,176,0.08)" stroke="rgba(44,185,176,0.3)" strokeWidth="1"/>
                <rect x="166" y="320" width="60" height="6" rx="3" fill="rgba(44,185,176,0.5)"/>
                <rect x="166" y="330" width="40" height="4" rx="2" fill="rgba(44,185,176,0.3)"/>
                <rect x="280" y="318" width="50" height="20" rx="6" fill="rgba(44,185,176,0.3)"/>
                <text x="305" y="332" textAnchor="middle" fill="#2cb9b0" fontSize="10" fontWeight="700">+12%</text>
                {/* Puntos neón */}
                <circle cx="60" cy="310" r="35" fill="rgba(127,90,240,0.06)"/>
                <circle cx="440" cy="55" r="45" fill="rgba(44,185,176,0.05)"/>
                <circle cx="250" cy="370" r="5" fill="#7f5af0" opacity="0.7" filter="url(#glow)"/>
                <circle cx="75" cy="195" r="3" fill="#4ade80" opacity="0.6" filter="url(#glow)"/>
                <circle cx="425" cy="295" r="4" fill="#e040fb" opacity="0.6" filter="url(#glow)"/>
              </svg>
            </div>
            <div className="hero-glow" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="quienes-somos" className="features-section">
        <div className="section-header">
          <span className="section-tag">Main Feature</span>
          <h2 className="section-title">Utiliza toda la funcionalidad</h2>
          <p className="section-subtitle">
            DigitalHub ofrece herramientas completas para administrar, asignar y
            hacer seguimiento de equipos tecnológicos en entornos educativos.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card featured">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </FeatureIcon>
            <h3>Registro de dispositivos</h3>
            <p>Administra y controla portátiles desde un solo sistema centralizado con información en tiempo real.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>

          <div className="feature-card">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2cb9b0" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </FeatureIcon>
            <h3>Control de responsables</h3>
            <p>Asigna responsables por horarios y ambientes con trazabilidad completa de cada movimiento.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>

          <div className="feature-card">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e040fb" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </FeatureIcon>
            <h3>Fichas de formación</h3>
            <p>Gestiona fichas por programa y jornada, vinculando aprendices con los equipos asignados.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>

          <div className="feature-card">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </FeatureIcon>
            <h3>Gestión de ambientes</h3>
            <p>Controla qué equipos están en cada aula o laboratorio con asignación por encargado.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>

          <div className="feature-card">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2cb9b0" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
            </FeatureIcon>
            <h3>Reportes y seguimiento</h3>
            <p>Obtén reportes claros sobre préstamos, devoluciones y estados de los equipos.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>

          <div className="feature-card">
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </FeatureIcon>
            <h3>Notificaciones</h3>
            <p>Recibe alertas sobre equipos dañados, asignaciones pendientes y reportes nuevos.</p>
            <a href="#servicios" className="feature-link">Leer más →</a>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="servicios" className="how-section">
        <div className="how-inner">
          <div className="how-img-wrap">
            <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'420px'}}>
              <defs>
                <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#120a2e"/>
                  <stop offset="100%" stopColor="#0a0a1a"/>
                </linearGradient>
                <filter id="glow2"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width="500" height="420" fill="url(#bg2)" rx="20"/>
              {/* Anillos */}
              <circle cx="250" cy="210" r="160" fill="none" stroke="rgba(127,90,240,0.1)" strokeWidth="1"/>
              <circle cx="250" cy="210" r="115" fill="none" stroke="rgba(44,185,176,0.1)" strokeWidth="1"/>
              <circle cx="250" cy="210" r="70" fill="rgba(127,90,240,0.05)" stroke="rgba(127,90,240,0.2)" strokeWidth="1"/>
              {/* Nodo central */}
              <circle cx="250" cy="210" r="38" fill="rgba(127,90,240,0.3)" stroke="#7f5af0" strokeWidth="2" filter="url(#glow2)"/>
              <text x="250" y="206" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">Digital</text>
              <text x="250" y="221" textAnchor="middle" fill="#c9a8ff" fontSize="11" fontWeight="600">Hub</text>
              {/* Nodos con colores distintos */}
              {[
                {cx:250, cy:75,  label:'Fichas',     color:'#4ade80', bg:'rgba(74,222,128,0.15)',  border:'rgba(74,222,128,0.5)'},
                {cx:378, cy:148, label:'Equipos',    color:'#2cb9b0', bg:'rgba(44,185,176,0.15)',  border:'rgba(44,185,176,0.5)'},
                {cx:378, cy:272, label:'Reportes',   color:'#facc15', bg:'rgba(250,204,21,0.15)',  border:'rgba(250,204,21,0.5)'},
                {cx:250, cy:345, label:'Usuarios',   color:'#f87171', bg:'rgba(248,113,113,0.15)', border:'rgba(248,113,113,0.5)'},
                {cx:122, cy:272, label:'Ambientes',  color:'#e040fb', bg:'rgba(224,64,251,0.15)',  border:'rgba(224,64,251,0.5)'},
                {cx:122, cy:148, label:'Asignación', color:'#c9a8ff', bg:'rgba(201,168,255,0.15)', border:'rgba(201,168,255,0.5)'},
              ].map((n, i) => (
                <g key={i}>
                  <line x1="250" y1="210" x2={n.cx} y2={n.cy} stroke={n.border} strokeWidth="1" strokeDasharray="4,4" opacity="0.6"/>
                  <circle cx={n.cx} cy={n.cy} r="30" fill={n.bg} stroke={n.border} strokeWidth="1.5"/>
                  <text x={n.cx} y={n.cy+4} textAnchor="middle" fill={n.color} fontSize="10" fontWeight="600">{n.label}</text>
                </g>
              ))}
              {/* Puntos orbitales */}
              <circle cx="250" cy="45" r="4" fill="#4ade80" filter="url(#glow2)"/>
              <circle cx="415" cy="210" r="4" fill="#2cb9b0" filter="url(#glow2)"/>
              <circle cx="85"  cy="210" r="4" fill="#e040fb" filter="url(#glow2)"/>
            </svg>
            <div className="how-img-overlay" />
          </div>

          <div className="how-content">
            <span className="section-tag">Cómo funciona</span>
            <div className="how-tabs">
              <button className="how-tab active">Plataforma web</button>
              <button className="how-tab">Gestión inteligente</button>
              <button className="how-tab">Enfoque innovador</button>
            </div>
            <h2>La intersección entre educación y tecnología</h2>
            <p>
              DigitalHub conecta a instructores, aprendices y administradores en una
              sola plataforma para gestionar los recursos tecnológicos de forma eficiente
              y transparente.
            </p>
            <ul className="how-list">
              <li>Registro y control de portátiles en tiempo real</li>
              <li>Asignación por fichas, jornadas y ambientes</li>
              <li>Reportes y trazabilidad completa</li>
            </ul>
            <Link to="/registrarse" className="btn-primary">Comenzar ahora</Link>
          </div>
        </div>
      </section>

      {/* ===== SUPPORT ===== */}
      <section id="soporte" className="support-section">
        <div className="support-inner">
          <div className="support-content">
            <span className="section-tag">Soporte</span>
            <h2>Soporte técnico confiable cuando más lo necesitas</h2>
            <p>
              El área de Soporte DigitalHub garantiza el correcto funcionamiento del
              sistema y la atención oportuna a incidencias técnicas dentro de la plataforma.
            </p>
            <p>
              Nuestro equipo supervisa accesos, notificaciones y reportes para asegurar
              una experiencia estable y segura para todos los usuarios.
            </p>
            <a href="#" className="btn-primary" style={{display:'inline-block', marginTop:'8px'}}>Contactar soporte</a>
          </div>

          <div className="support-img-wrap">
            <svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'420px'}}>
              <defs>
                <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0e0a28"/>
                  <stop offset="100%" stopColor="#0a0a1a"/>
                </linearGradient>
                <filter id="glow3"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width="500" height="420" fill="url(#bg3)" rx="20"/>
              {[0,1,2,3,4,5].map(i=>(
                <line key={i} x1="0" y1={i*84} x2="500" y2={i*84} stroke="rgba(127,90,240,0.06)" strokeWidth="1"/>
              ))}
              {/* Shield */}
              <path d="M250 55 L345 98 L345 205 Q345 278 250 318 Q155 278 155 205 L155 98 Z" fill="rgba(127,90,240,0.1)" stroke="#7f5af0" strokeWidth="2" filter="url(#glow3)"/>
              <path d="M250 82 L322 118 L322 205 Q322 260 250 292 Q178 260 178 205 L178 118 Z" fill="rgba(44,185,176,0.06)" stroke="rgba(44,185,176,0.3)" strokeWidth="1"/>
              {/* Check cian */}
              <polyline points="218,188 240,210 288,158" fill="none" stroke="#2cb9b0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow3)"/>
              {/* Card verde */}
              <rect x="340" y="72" width="128" height="54" rx="10" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.4)" strokeWidth="1"/>
              <circle cx="360" cy="99" r="9" fill="rgba(74,222,128,0.5)"/>
              <rect x="376" y="92" width="74" height="6" rx="3" fill="rgba(74,222,128,0.5)"/>
              <rect x="376" y="103" width="52" height="4" rx="2" fill="rgba(74,222,128,0.3)"/>
              {/* Card magenta */}
              <rect x="32" y="112" width="118" height="54" rx="10" fill="rgba(224,64,251,0.08)" stroke="rgba(224,64,251,0.4)" strokeWidth="1"/>
              <circle cx="52" cy="139" r="9" fill="rgba(224,64,251,0.5)"/>
              <rect x="68" y="132" width="64" height="6" rx="3" fill="rgba(224,64,251,0.5)"/>
              <rect x="68" y="143" width="46" height="4" rx="2" fill="rgba(224,64,251,0.3)"/>
              {/* Stats con colores */}
              <rect x="52" y="330" width="112" height="62" rx="12" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.35)" strokeWidth="1"/>
              <text x="108" y="360" textAnchor="middle" fill="#4ade80" fontSize="24" fontWeight="800">99%</text>
              <text x="108" y="378" textAnchor="middle" fill="rgba(74,222,128,0.6)" fontSize="10">Disponibilidad</text>

              <rect x="194" y="330" width="112" height="62" rx="12" fill="rgba(44,185,176,0.08)" stroke="rgba(44,185,176,0.35)" strokeWidth="1"/>
              <text x="250" y="360" textAnchor="middle" fill="#2cb9b0" fontSize="24" fontWeight="800">24/7</text>
              <text x="250" y="378" textAnchor="middle" fill="rgba(44,185,176,0.6)" fontSize="10">Soporte</text>

              <rect x="336" y="330" width="112" height="62" rx="12" fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.35)" strokeWidth="1"/>
              <text x="392" y="360" textAnchor="middle" fill="#facc15" fontSize="24" fontWeight="800">+50</text>
              <text x="392" y="378" textAnchor="middle" fill="rgba(250,204,21,0.6)" fontSize="10">Equipos</text>

              <circle cx="425" cy="215" r="5" fill="#facc15" filter="url(#glow3)"/>
              <circle cx="75"  cy="275" r="4" fill="#4ade80" filter="url(#glow3)"/>
              <circle cx="460" cy="295" r="3" fill="#e040fb" opacity="0.7"/>
            </svg>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

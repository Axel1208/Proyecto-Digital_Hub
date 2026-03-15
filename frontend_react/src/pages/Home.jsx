import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Navbar />

      <section id="inicio" className="section section-dark">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Gestiona el seguimiento de tu equipo aquí</h1>
            <p className="hero-description">
              DigitalHub es un sistema independiente que funciona como una plataforma web,
              diseñada para apoyar la gestión y seguimiento de portátiles dentro de un ambiente
              formativo como aulas, laboratorios o centros educativos.
            </p>
            <p className="hero-description">
              Centraliza la información de uso y control de los equipos, permitiendo registrar
              quién es el responsable de cada portátil en diferentes franjas horarias y asignar
              un encargado general por ambiente.
            </p>
            <Link to="/registrarse" className="btn-hero">Únete ahora</Link>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" alt="Equipo de trabajo" />
          </div>
        </div>
      </section>

      <section id="quienes-somos" className="section section-light">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Somos DigitalHub</h2>
              <p className="section-description">
                DigitalHub es una plataforma web orientada a optimizar la administración,
                asignación y seguimiento de equipos tecnológicos dentro de los ambientes
                de formación.
              </p>
              <p className="section-description">
                Facilitamos el control de portátiles por jornada, garantizando
                trazabilidad, organización y transparencia en la gestión de recursos
                tecnológicos.
              </p>
              <a href="#servicios" className="btn-secondary">Conoce nuestros servicios</a>
            </div>
            <div className="content-image">
              <img src="/img/team.jpg" alt="Nuestro equipo" />
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="section section-light">
        <div className="container">
          <div className="services-header">
            <h2 className="section-title">Nuestros servicios digitales</h2>
            <p className="section-description">
              DigitalHub ofrece soluciones digitales enfocadas en la gestión, control y
              seguimiento de dispositivos tecnológicos en entornos educativos y empresariales.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/ds.png" alt="Registro de dispositivos" height="50" width="50" />
              </div>
              <h3>Registro de dispositivos</h3>
              <p>Administra y controla portátiles y equipos tecnológicos desde un solo sistema.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/resp.png" alt="Control de responsables" height="50" width="50" />
              </div>
              <h3>Control de responsables</h3>
              <p>Asigna responsables por horarios y ambientes con total trazabilidad.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/grafica.jpg" alt="Reportes y seguimiento" height="50" width="50" />
              </div>
              <h3>Reportes y seguimiento</h3>
              <p>Obtén reportes claros sobre préstamos, devoluciones y estados de los equipos.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="soporte" className="section section-dark">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Soporte técnico confiable cuando más lo necesitas</h2>
              <p className="section-description">
                El área de Soporte DigitalHub se encarga de garantizar el correcto
                funcionamiento del sistema y la atención oportuna a incidencias
                técnicas dentro de la plataforma.
              </p>
              <p className="section-description">
                Nuestro equipo supervisa accesos, notificaciones y reportes para
                asegurar una experiencia estable y segura.
              </p>
              <a href="" className="btn-hero">Contactar soporte</a>
            </div>
            <div className="content-image">
              <img src="/img/st.jpg" alt="Soporte técnico" height="400" width="250" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

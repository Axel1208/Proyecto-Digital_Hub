import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© 2026 DigitalHub. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="">Términos y condiciones</a>
          <span>·</span>
          <a href="">Política de privacidad</a>
          <span>·</span>
          <a href="">Contáctenos</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="register-page">
      <Navbar showAuth={false} />

      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-header">
            <div className="logo-circle">
              <img src="/img/logo - copia.png" alt="DigitalHub" />
            </div>
            <h1>Registrarse</h1>
            <p>Crea tu cuenta en DigitalHub</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecciona tu rol</option>
                <option value="instructor">Instructor</option>
                <option value="encargado">Encargado</option>
              </select>
            </div>

            <button className="btn-submit" type="submit">Registrarse</button>
          </form>

          <div className="register-footer">
            <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;

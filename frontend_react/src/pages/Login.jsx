import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: formData.email, password: formData.password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/equipos');

    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar showAuth={false} />

      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <div className="logo-circle">
              <img src="/img/logo - copia.png" alt="DigitalHub" />
            </div>
            <h1>Iniciar sesión</h1>
            <p>Bienvenido de nuevo a DigitalHub</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="login-forgot">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>¿No tienes una cuenta? <a href="/registrarse">Regístrate</a></p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

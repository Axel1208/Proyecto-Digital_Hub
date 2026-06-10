import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IconCode, IconCoffee, IconHeart } from "../components/Icons";
import "./FuelDevs.css";

const FuelDevs = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fuelLevels = [
    {
      id: "first-time",
      name: "Primera vez viendo esto",
      amount: 3000,
      description: "Un RedBull de supervivencia",
      icon: IconCoffee,
      color: "#4ade80"
    },
    {
      id: "interesting",
      name: "Me gusta la idea",
      amount: 8000,
      description: "Pizza de medianoche para pensar",
      icon: IconCode,
      color: "#2cb9b0"
    },
    {
      id: "awesome",
      name: "Esto está genial",
      amount: 15000,
      description: "Snacks para la próxima maratón",
      icon: IconHeart,
      color: "#7f5af0"
    },
    {
      id: "rockstar",
      name: "Son unos cracks",
      amount: 30000,
      description: "Fondo para el siguiente imposible",
      icon: IconCode,
      color: "#e040fb"
    }
  ];

  const handleAmountSelect = async (level) => {
    if (loading) return;
    setSelectedAmount(level.amount);
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/wompi/crear-transaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: level.amount,
          currency: 'COP',
          customerEmail: 'donacion@digitalhub.co',
          customerName: 'Donación Digital Hub',
          reference: `FUEL_${Date.now()}`,
          description: `Fuel: ${level.name}`,
          paymentMethod: 'CARD'
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('El servidor no respondió con JSON válido');
      }

      const data = await response.json();
      const url = data?.data?.checkoutUrl || data?.data?.permalink;

      if (data.success && url) {
        // Wompi bloquea iframes — abrir en nueva pestaña directamente
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        setErrorMessage(data.mensaje || data?.error?.reason || 'Error al procesar el pago. Intenta nuevamente.');
      }
    } catch (error) {
      if (error.message.includes('HTTP 502')) {
        setErrorMessage('Error de servidor. Verifica que el backend esté ejecutándose.');
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage('Error de conexión. Verifica tu internet.');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
      setSelectedAmount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuel-page">
      <Navbar />

      <div className="fuel-container">
        <div className="fuel-header">
          <div className="fuel-badge">
            <div className="fuel-badge-dot" />
            Proyecto estudiantil
          </div>

          <h1 className="fuel-title">Fuel para Developers</h1>

          <p className="fuel-subtitle">
            Desarrollado con 73% persistencia y 27% Stack Overflow
          </p>
        </div>

        <div className="fuel-story">
          <div className="story-section">
            <h2>La Historia</h2>
            <p>
              Este proyecto empezó con la frase más peligrosa de la programación:
              <strong> "No puede ser tan difícil..."</strong>
            </p>
            <p className="spoiler">Spoiler alert: SÍ era tan difícil.</p>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">47</div>
                <div className="stat-label">Noches de insomnio productivo</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">156</div>
                <div className="stat-label">Búsquedas desesperadas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">23</div>
                <div className="stat-label">Crisis por punto y coma</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1</div>
                <div className="stat-label">Momento épico final</div>
              </div>
            </div>

            <p className="final-message">
              Aquí tienes DigitalHub. <strong>Gratis para siempre.</strong><br />
              Porque la persistencia estudiantil no tiene precio.
            </p>
          </div>
        </div>

        <div className="fuel-section">
          <h2>¿Quieres patrocinar la próxima aventura?</h2>
          <p>Selecciona un nivel y paga directo con Wompi:</p>

          {errorMessage && (
            <div className="message-error" style={{ marginBottom: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errorMessage}
            </div>
          )}

          <div className="fuel-levels" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
            {fuelLevels.map((level) => {
              const Icon = level.icon;
              const isSelected = selectedAmount === level.amount;
              const isOther = loading && !isSelected;
              return (
                <div
                  key={level.id}
                  className={`fuel-card ${isSelected && loading ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(level)}
                  style={{
                    '--card-color': level.color,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: isOther ? 0.4 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div className="fuel-card-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{level.name}</h3>
                  <div className="fuel-amount">${level.amount.toLocaleString()}</div>
                  <p>{level.description}</p>
                  <div className="fuel-card-action">
                    {isSelected && loading ? (
                      <>
                        <div className="spinner" style={{ display: 'inline-block', width: '14px', height: '14px', marginRight: '6px' }} />
                        Procesando...
                      </>
                    ) : (
                      'Pagar ahora →'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fuel-footer">
          <p>¿Por qué hacemos esto gratis?</p>
          <p>
            Porque recordamos cuando éramos estudiantes buscando proyectos chéveres
            en GitHub para aprender. Este es nuestro granito de arena al mundo
            de developers que vienen detrás.
          </p>
          <p>¿Te suma? ¿Quieres sumar? Todo cool por aquí.</p>

          <Link to="/" className="back-home">
            Volver al inicio
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FuelDevs;

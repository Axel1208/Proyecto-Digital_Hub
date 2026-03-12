import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './EquipmentManagement.css';

const EquipmentManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    serial: '',
    marca: '',
    estado: 'Operativo',
    ambiente: 'Ambiente 1',
    usuario: 'Sin asignar'
  });

  const [equipments, setEquipments] = useState([
    { id: 1, aprendiz: 'Laura Valentina Fajardo', ficha: '3146013', jornada: 'Mañana', ambiente: '4110' },
    { id: 2, aprendiz: 'Juan David Ospina', ficha: '3146013', jornada: 'Noche', ambiente: '4110' },
    { id: 3, aprendiz: 'Santiago Andrés Alvarado', ficha: '3146013', jornada: 'Tarde', ambiente: '4110' },
    { id: 4, aprendiz: 'Nicolas Felipe Martinez', ficha: '3146013', jornada: 'Mañana', ambiente: '4110' },
    { id: 5, aprendiz: 'Natalia Bragolias Nina', ficha: '3146013', jornada: 'Noche', ambiente: '4110' },
    { id: 6, aprendiz: 'Sergio Alejandro Torero', ficha: '3146013', jornada: 'Tarde', ambiente: '4110' }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo equipo:', formData);
    setShowModal(false);
    setFormData({
      nombre: '',
      serial: '',
      marca: '',
      estado: 'Operativo',
      ambiente: 'Ambiente 1',
      usuario: 'Sin asignar'
    });
  };

  return (
    <div className="equipment-layout">
      <Sidebar />
      
      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <h1 className="equipment-title">Gestión de equipos</h1>
            <p className="equipment-subtitle">Total de equipos registrados: <span>48</span></p>
          </div>
          <button className="notification-btn">🔔</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Aprendices Activos</div>
            <div className="stat-value">127</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-label">Equipos Asignados</div>
            <div className="stat-value">32</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Registros Semanales</div>
            <div className="stat-value">54</div>
          </div>
        </div>

        <div className="filters-row">
          <input type="text" placeholder="Estado" className="filter-input" />
          <input type="text" placeholder="Situación" className="filter-input" />
          <input type="text" placeholder="Modelo" className="filter-input" />
          <input type="text" placeholder="Buscar" className="filter-input filter-search" />
        </div>

        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Aprendiz</th>
                <th>Ficha</th>
                <th>Jornada</th>
                <th>Ambiente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.aprendiz}</td>
                  <td>{equipment.ficha}</td>
                  <td>{equipment.jornada}</td>
                  <td>{equipment.ambiente}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">✏️</button>
                      <button className="action-btn delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-add-equipment" onClick={() => setShowModal(true)}>
          Añadir Portátiles
        </button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Añadir nuevo equipo</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Número de equipo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Serial</label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Marca / Modelo</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ambiente</label>
                  <select
                    name="ambiente"
                    value={formData.ambiente}
                    onChange={handleInputChange}
                  >
                    <option value="Ambiente 1">Ambiente 1</option>
                    <option value="Ambiente 2">Ambiente 2</option>
                    <option value="Ambiente 3">Ambiente 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Usuario actual</label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EquipmentManagement;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import EquipmentManagement from './pages/EquipmentManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/panel" element={<EquipmentManagement />} />
        <Route path="/historial" element={<EquipmentManagement />} />
        <Route path="/fichas" element={<EquipmentManagement />} />
        <Route path="/comentarios" element={<EquipmentManagement />} />
        <Route path="/papelero" element={<EquipmentManagement />} />
        <Route path="/ajustes" element={<EquipmentManagement />} />
        <Route path="/notificaciones" element={<EquipmentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

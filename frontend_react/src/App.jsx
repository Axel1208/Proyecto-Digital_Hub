import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EquipmentManagement from './pages/EquipmentManagement';
import Fichas from './pages/Fichas';
import Comentarios from './pages/Comentarios';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<EquipmentManagement />} />
        <Route path="/historial" element={<EquipmentManagement />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/comentarios" element={<Comentarios />} />
        <Route path="/papelero" element={<EquipmentManagement />} />
        <Route path="/ajustes" element={<EquipmentManagement />} />
        <Route path="/notificaciones" element={<EquipmentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

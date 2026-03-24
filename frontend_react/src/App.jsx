import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EquipmentManagement from './pages/EquipmentManagement';


// Admin
import InicioAdmin from './pages/admin/Inicio';
import EquiposAdmin from './pages/admin/EquiposAdmin';
import AjustesAdmin from './pages/admin/AjustesAdmin';

// Instructor
import InicioInstructor from './pages/instructor/InicioInstructor';
import EquiposInstructor from './pages/instructor/EquiposInstructor';
import ComentariosInstructor from './pages/instructor/ReportesInstructor';
import AjustesInstructor from './pages/instructor/AjustesInstructor';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/inicio"      element={<InicioAdmin />} />
        <Route path="/admin/equipos"     element={<EquiposAdmin />} />
        <Route path="/admin/historial"   element={<EquiposAdmin />} />
        <Route path="/admin/papelera"    element={<EquiposAdmin />} />
        <Route path="/admin/ajustes"     element={<AjustesAdmin />} />

        {/* Instructor */}
        <Route path="/instructor/inicio"      element={<InicioInstructor />} />
        <Route path="/instructor/equipos"     element={<EquiposInstructor />} />
        <Route path="/instructor/comentarios" element={<ComentariosInstructor />} />
        <Route path="/instructor/reportes"    element={<ComentariosInstructor />} />
        <Route path="/instructor/historial"   element={<EquiposInstructor />} />
        <Route path="/instructor/papelera"    element={<EquiposInstructor />} />
        <Route path="/instructor/ajustes"     element={<AjustesInstructor />} />

        {/* Legado */}
        <Route path="/panel"       element={<EquipmentManagement />} />
        <Route path="/equipos"     element={<EquipmentManagement />} />
        <Route path="/historial"   element={<EquipmentManagement />} />
        <Route path="/papelera"    element={<EquipmentManagement />} />

      </Routes>
    </Router>
  );
}

export default App;

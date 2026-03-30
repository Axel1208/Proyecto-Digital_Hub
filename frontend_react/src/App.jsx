import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EquipmentManagement from './pages/EquipmentManagement';

import InicioAdmin from './pages/admin/Inicio';
import EquiposAdmin from './pages/admin/EquiposAdmin';
import HistorialAdmin from './pages/admin/HistorialAdmin';
import PapeleraAdmin from './pages/admin/PapeleraAdmin';
import AjustesAdmin from './pages/admin/AjustesAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import ReportesAdmin from './pages/admin/ReportesAdmin';
import AmbientesAdmin from './pages/admin/AmbientesAdmin';
import FichasAdmin from './pages/admin/FichasAdmin';

import InicioInstructor from './pages/instructor/InicioInstructor';
import EquiposInstructor from './pages/instructor/EquiposInstructor';
import ReportesInstructor from './pages/instructor/ReportesInstructor';
import HistorialInstructor from './pages/instructor/HistorialInstructor';
import PapeleraInstructor from './pages/instructor/PapeleraInstructor';
import AjustesInstructor from './pages/instructor/AjustesInstructor';
import FichasInstructor from './pages/instructor/FichasInstructor';

import InicioAprendiz from './pages/aprendiz/InicioAprendiz';
import EquiposAprendiz from './pages/aprendiz/EquiposAprendiz';
import ReportesAprendiz from './pages/aprendiz/ReportesAprendiz';
import HistorialAprendiz from './pages/aprendiz/HistorialAprendiz';
import AjustesAprendiz from './pages/aprendiz/AjustesAprendiz';
import FichasAprendiz from './pages/aprendiz/FichasAprendiz';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/inicio"    element={<InicioAdmin />} />
        <Route path="/admin/equipos"   element={<EquiposAdmin />} />
        <Route path="/admin/historial" element={<HistorialAdmin />} />
        <Route path="/admin/papelera"  element={<PapeleraAdmin />} />
        <Route path="/admin/ajustes"   element={<AjustesAdmin />} />
        <Route path="/admin/usuarios"   element={<UsuariosAdmin />} />
        <Route path="/admin/reportes"   element={<ReportesAdmin />} />
        <Route path="/admin/ambientes"  element={<AmbientesAdmin />} />
        <Route path="/admin/fichas"     element={<FichasAdmin />} />

        <Route path="/instructor/inicio"    element={<InicioInstructor />} />
        <Route path="/instructor/equipos"   element={<EquiposInstructor />} />
        <Route path="/instructor/reportes"  element={<ReportesInstructor />} />
        <Route path="/instructor/comentarios" element={<ReportesInstructor />} />
        <Route path="/instructor/historial" element={<HistorialInstructor />} />
        <Route path="/instructor/papelera"  element={<PapeleraInstructor />} />
        <Route path="/instructor/ajustes"   element={<AjustesInstructor />} />
        <Route path="/instructor/fichas"    element={<FichasInstructor />} />

        <Route path="/aprendiz/inicio"    element={<InicioAprendiz />} />
        <Route path="/aprendiz/equipos"   element={<EquiposAprendiz />} />
        <Route path="/aprendiz/reportes"  element={<ReportesAprendiz />} />
        <Route path="/aprendiz/historial" element={<HistorialAprendiz />} />
        <Route path="/aprendiz/ajustes"   element={<AjustesAprendiz />} />
        <Route path="/aprendiz/fichas"    element={<FichasAprendiz />} />

        <Route path="/panel"     element={<EquipmentManagement />} />
        <Route path="/equipos"   element={<EquipmentManagement />} />
        <Route path="/historial" element={<EquipmentManagement />} />
        <Route path="/papelera"  element={<EquipmentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

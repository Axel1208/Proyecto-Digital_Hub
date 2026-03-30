const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const { ROLES } = require("../constants/dominio");
const { 
    exportarPortatilesExcel, exportarPortatilesCSV,
    exportarUsuariosExcel, exportarUsuariosCSV,
    exportarAmbientesExcel, exportarAmbientesCSV 
} = require("../services/exportacion.service");

// PORTATILES
router.get("/portatiles/excel", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), exportarPortatilesExcel);
router.get("/portatiles/csv", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), exportarPortatilesCSV);

// USUARIOS (Solo Admin y instructor)
router.get("/usuarios/excel", verificarToken, verificarRol([ROLES.ADMIN,ROLES.INSTRUCTOR]), exportarUsuariosExcel);
router.get("/usuarios/csv", verificarToken, verificarRol([ROLES.ADMIN,ROLES.INSTRUCTOR]), exportarUsuariosCSV);

// AMBIENTES
router.get("/ambientes/excel", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), exportarAmbientesExcel);
router.get("/ambientes/csv", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), exportarAmbientesCSV);

module.exports = router;
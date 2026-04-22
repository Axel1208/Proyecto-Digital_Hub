const express = require("express");
const router = express.Router();

const {
  enviarCodigo,
  validarCodigo,
  cambiarPassword
} = require("../controllers/recuperacion.controller");

// ===============================
// RUTAS DE RECUPERACIÓN
// ===============================

// 1. Enviar código al correo
router.post("/enviar-codigo", enviarCodigo);

// 2. Validar código
router.post("/validar-codigo", validarCodigo);

// 3. Cambiar contraseña
router.post("/cambiar-password", cambiarPassword);

module.exports = router;
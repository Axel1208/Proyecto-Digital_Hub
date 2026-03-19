const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/database");

const {
  validarRol,
  validarCorreo
} = require("../utils/validadoresDominio");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

const { ESTADOS_USUARIO, ROLES } = require("../constants/dominio");

// ==============================
// TEST
// ==============================
router.get("/test", (req, res) => {
  res.json({ mensaje: "usuarios funcionando" });
});

// ==============================
// REGISTRO
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    if (!validarCorreo(correo)) {
      return res.status(400).json({
        mensaje: "Correo inválido"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres"
      });
    }

    const [existe] = await db.query(
      "SELECT id_usuario FROM usuario WHERE correo = ?",
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO usuario (nombre, correo, password_hash, rol, estado) VALUES (?, ?, ?, ?, ?)",
      [nombre, correo, password_hash, ROLES.APRENDIZ, ESTADOS_USUARIO[0]]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error en el registro"
    });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const [usuarios] = await db.query(
      "SELECT * FROM usuario WHERE correo = ?",
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const usuario = usuarios[0];

    // ✔ Validación correcta del estado
    if (usuario.estado !== "activo") {
      return res.status(403).json({
        mensaje: "Usuario inactivo"
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.rol,
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
});

// ==============================
// LISTAR USUARIOS
// ==============================
router.get(
  "/",
  verificarToken,
  verificarRol(ROLES.ADMIN, ROLES.INSTRUCTOR),
  async (req, res) => {
    try {
      const [usuarios] = await db.query(
        "SELECT id_usuario, nombre, correo, rol, estado FROM usuario"
      );

      res.json(usuarios);

    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al listar usuarios"
      });
    }
  }
);

module.exports = router;
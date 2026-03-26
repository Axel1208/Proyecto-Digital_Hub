const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

const {
  validarRol,
  validarCorreo
} = require("../utils/validadoresDominio");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

const {
  ESTADOS_USUARIO,
  ESTADO_USUARIO_ACTIVO,
  ROLES
} = require("../constants/dominio");

// ==============================
// 🔧 NORMALIZAR TEXTO
// ==============================
const normalizarTexto = (texto) => {
  return typeof texto === "string" ? texto.trim().toLowerCase() : "";
};

// ==============================
// 🔧 VALIDAR ESTADO
// ==============================
const validarEstado = (estado) => {
  return ESTADOS_USUARIO.includes(estado);
};

// ==============================
// 🔧 VALIDAR NOMBRE
// ==============================
const validarNombre = (nombre) => {
  return typeof nombre === "string" && nombre.trim().length >= 3;
};

// ==============================
// TEST
// ==============================
router.get("/test", (req, res) => {
  res.json({ mensaje: "usuarios funcionando" });
});

// ==============================
// REGISTRO (PÚBLICO)
// ==============================
router.post(
  "/register",
  validarCamposObligatorios(["nombre", "correo", "password"]),
  async (req, res) => {
    try {
      let { nombre, correo, password } = req.body;

      if (!validarNombre(nombre)) {
        return res.status(400).json({
          mensaje: "El nombre debe tener al menos 3 caracteres"
        });
      }

      if (!validarCorreo(correo)) {
        return res.status(400).json({
          mensaje: "Correo inválido"
        });
      }

      if (typeof password !== "string" || password.length < 6) {
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
        [nombre.trim(), correo, password_hash, ROLES.APRENDIZ, ESTADO_USUARIO_ACTIVO]
      );

      res.status(201).json({
        mensaje: "Usuario registrado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR REGISTER:", error);
      res.status(500).json({
        mensaje: "Error en el registro"
      });
    }
  }
);

// ==============================
// LOGIN
// ==============================
router.post(
  "/login",
  validarCamposObligatorios(["correo", "password"]),
  async (req, res) => {
    try {
      let { correo, password } = req.body;

      correo = normalizarTexto(correo);

      const [usuarios] = await db.query(
        "SELECT id_usuario, nombre, correo, password_hash, rol, estado FROM usuario WHERE correo = ?",
        [correo]
      );

      if (usuarios.length === 0) {
        return res.status(401).json({
          mensaje: "Credenciales inválidas"
        });
      }

      const usuario = usuarios[0];

      if (usuario.estado !== ESTADO_USUARIO_ACTIVO) {
        return res.status(403).json({
          mensaje: "Usuario inhabilitado"
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
    console.error("🔥 ERROR LOGIN:", error);
    res.status(500).json({
      mensaje: "Error interno"
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
      console.error("🔥 ERROR LIST:", error);
      res.status(500).json({
        mensaje: "Error al listar usuarios"
      });
    }
  }
);

// ==============================
// CREAR USUARIO
// ==============================
router.post(
  "/",
  verificarToken,
  verificarRol(ROLES.ADMIN, ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "correo", "password", "rol"]),
  async (req, res) => {
    try {
      let { nombre, correo, password, rol, estado } = req.body;

      if (!validarNombre(nombre) || !correo || !password || !rol) {
        return res.status(400).json({
          mensaje: "Datos inválidos"
        });
      }

      correo = normalizarTexto(correo);
      rol = normalizarTexto(rol);
      estado = estado ? normalizarTexto(estado) : ESTADO_USUARIO_ACTIVO;

      if (!validarCorreo(correo)) {
        return res.status(400).json({
          mensaje: "Correo inválido"
        });
      }

      if (!validarRol(rol)) {
        return res.status(400).json({
          mensaje: "Rol inválido"
        });
      }

      if (!validarEstado(estado)) {
        return res.status(400).json({
          mensaje: "Estado inválido"
        });
      }

      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          mensaje: "La contraseña debe tener mínimo 6 caracteres"
        });
      }

      if (req.usuario.rol === ROLES.INSTRUCTOR && rol === ROLES.ADMIN) {
        return res.status(403).json({
          mensaje: "Un instructor no puede crear administradores"
        });
      }

      const [existe] = await db.query(
        "SELECT id_usuario FROM usuario WHERE correo = ?",
        [correo]
      );

      if (existe.length > 0) {
        return res.status(400).json({
          mensaje: "El correo ya existe"
        });
      }

      const password_hash = await bcrypt.hash(password, 10);

      await db.query(
        "INSERT INTO usuario (nombre, correo, password_hash, rol, estado) VALUES (?, ?, ?, ?, ?)",
        [nombre.trim(), correo, password_hash, rol, estado]
      );

      res.status(201).json({
        mensaje: "Usuario creado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR CREATE:", error);
      res.status(500).json({
        mensaje: "Error al crear usuario"
      });
    }
  }
);

// ==============================
// ACTUALIZAR USUARIO
// ==============================
router.put(
  "/:id",
  verificarToken,
  verificarRol(ROLES.ADMIN, ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "correo", "rol", "estado"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: "ID inválido"
        });
      }

      let { nombre, correo, rol, estado } = req.body;

      if (!validarNombre(nombre) || !correo || !rol || !estado) {
        return res.status(400).json({
          mensaje: "Datos inválidos"
        });
      }

      correo = normalizarTexto(correo);
      rol = normalizarTexto(rol);
      estado = normalizarTexto(estado);

      if (!validarCorreo(correo)) {
        return res.status(400).json({
          mensaje: "Correo inválido"
        });
      }

      if (!validarRol(rol)) {
        return res.status(400).json({
          mensaje: "Rol inválido"
        });
      }

      if (!validarEstado(estado)) {
        return res.status(400).json({
          mensaje: "Estado inválido"
        });
      }

      const [usuarioDB] = await db.query(
        "SELECT * FROM usuario WHERE id_usuario = ?",
        [id]
      );

      if (usuarioDB.length === 0) {
        return res.status(404).json({
          mensaje: "Usuario no existe"
        });
      }

      const [correoExistente] = await db.query(
        "SELECT id_usuario FROM usuario WHERE correo = ? AND id_usuario != ?",
        [correo, id]
      );

      if (correoExistente.length > 0) {
        return res.status(400).json({
          mensaje: "El correo ya está en uso"
        });
      }

      if (
        req.usuario.rol === ROLES.INSTRUCTOR &&
        usuarioDB[0].rol === ROLES.ADMIN
      ) {
        return res.status(403).json({
          mensaje: "No puedes modificar un administrador"
        });
      }

      if (
        req.usuario.rol === ROLES.INSTRUCTOR &&
        rol === ROLES.ADMIN
      ) {
        return res.status(403).json({
          mensaje: "No puedes asignar rol administrador"
        });
      }

      await db.query(
        "UPDATE usuario SET nombre=?, correo=?, rol=?, estado=? WHERE id_usuario=?",
        [nombre.trim(), correo, rol, estado, id]
      );

      res.json({
        mensaje: "Usuario actualizado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR UPDATE:", error);
      res.status(500).json({
        mensaje: "Error al actualizar"
      });
    }
  }
);

// ==============================
// ELIMINAR USUARIO
// ==============================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(ROLES.ADMIN, ROLES.INSTRUCTOR),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: "ID inválido"
        });
      }

      if (req.usuario.id === Number(id)) {
        return res.status(400).json({
          mensaje: "No puedes eliminar tu propio usuario"
        });
      }

      const [usuarioDB] = await db.query(
        "SELECT * FROM usuario WHERE id_usuario = ?",
        [id]
      );

      if (usuarioDB.length === 0) {
        return res.status(404).json({
          mensaje: "Usuario no existe"
        });
      }

      if (
        req.usuario.rol === ROLES.INSTRUCTOR &&
        usuarioDB[0].rol === ROLES.ADMIN
      ) {
        return res.status(403).json({
          mensaje: "No puedes eliminar un administrador"
        });
      }

      await db.query(
        "DELETE FROM usuario WHERE id_usuario = ?",
        [id]
      );

      res.json({
        mensaje: "Usuario eliminado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR DELETE:", error);
      res.status(500).json({
        mensaje: "Error al eliminar"
      });
    }
  }
);

module.exports = router;
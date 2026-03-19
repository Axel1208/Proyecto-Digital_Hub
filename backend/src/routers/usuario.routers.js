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
// 🔧 NORMALIZAR TEXTO
// ==============================
const normalizarTexto = (texto) => {
  return texto.trim().toLowerCase();
};

// ==============================
// 🔧 VALIDAR ESTADO
// ==============================
const validarEstado = (estado) => {
  return ESTADOS_USUARIO.includes(estado);
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
router.post("/register", async (req, res) => {
  try {
    let { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    correo = normalizarTexto(correo);

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
    console.error("🔥 ERROR REGISTER:", error);
    res.status(500).json({
      mensaje: "Error en el registro",
      error: error.message
    });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    let { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    correo = normalizarTexto(correo);

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
    console.error("🔥 ERROR LOGIN:", error);
    res.status(500).json({
      mensaje: "Error interno",
      error: error.message
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
        mensaje: "Error al listar usuarios",
        error: error.message
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
  async (req, res) => {
    try {
      let { nombre, correo, password, rol, estado } = req.body;

      if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({
          mensaje: "Campos obligatorios incompletos"
        });
      }

      correo = normalizarTexto(correo);
      rol = normalizarTexto(rol);
      estado = estado ? normalizarTexto(estado) : ESTADOS_USUARIO[0];

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

      // 🚫 INSTRUCTOR no puede crear ADMIN
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
        [nombre, correo, password_hash, rol, estado]
      );

      res.status(201).json({
        mensaje: "Usuario creado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR CREATE:", error);
      res.status(500).json({
        mensaje: "Error al crear usuario",
        error: error.message
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
  async (req, res) => {
    try {
      const { id } = req.params;
      let { nombre, correo, rol, estado } = req.body;

      if (!nombre || !correo || !rol || !estado) {
        return res.status(400).json({
          mensaje: "Campos obligatorios incompletos"
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

      // 🔥 CORREO REPETIDO
      const [correoExistente] = await db.query(
        "SELECT id_usuario FROM usuario WHERE correo = ? AND id_usuario != ?",
        [correo, id]
      );

      if (correoExistente.length > 0) {
        return res.status(400).json({
          mensaje: "El correo ya está en uso"
        });
      }

      // 🚫 INSTRUCTOR no modifica ADMIN
      if (
        req.usuario.rol === ROLES.INSTRUCTOR &&
        usuarioDB[0].rol === ROLES.ADMIN
      ) {
        return res.status(403).json({
          mensaje: "No puedes modificar un administrador"
        });
      }

      // 🚫 INSTRUCTOR no asigna ADMIN
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
        [nombre, correo, rol, estado, id]
      );

      res.json({
        mensaje: "Usuario actualizado correctamente"
      });

    } catch (error) {
      console.error("🔥 ERROR UPDATE:", error);
      res.status(500).json({
        mensaje: "Error al actualizar",
        error: error.message
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
        mensaje: "Error al eliminar",
        error: error.message
      });
    }
  }
);

module.exports = router;
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/database");
const {
    validarRol,
    validarEstadoUsuario,
    validarCorreo
} = require("../utils/validadoresDominio");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

const rolesValidos = ["administrador", "instructor", "aprendiz"];

router.get("/test", (req,res)=>{
  res.json({mensaje:"funciona"});
});
// ==============================
// LOGIN
// POST /api/usuarios/login
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
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
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
                mensaje: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                rol: usuario.rol
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
// CREAR USUARIO
// POST /api/usuarios
// ==============================
router.post(
    "/",
    verificarToken,
    verificarRol("administrador", "instructor"),
    async (req, res) => {

        try {

            const { nombre, correo, password, rol } = req.body;

            if (!nombre || !correo || !password || !rol) {
                return res.status(400).json({
                    mensaje: "Todos los campos son obligatorios"
                });
            }

           if (!validarRol(rol)) {
                return res.status(400).json({
                    mensaje: "Rol inválido"
                });
            }

            if (!validarCorreo(correo)) {
                return res.status(400).json({
                mensaje: "Correo inválido"
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
                "INSERT INTO usuario (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)",
                [nombre, correo, password_hash, rol]
            );

            res.status(201).json({
                mensaje: "Usuario creado correctamente"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al crear usuario"
            });

        }

    }
);


// ==============================
// LISTAR USUARIOS
// GET /api/usuarios
// ==============================
router.get(
    "/",
    verificarToken,
    verificarRol("administrador", "instructor"),
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

// ==============================
// OBTENER USUARIO POR ID
// GET /api/:id
// ==============================

router.get(
  "/:id",
  verificarToken,
  verificarRol("administrador", "instructor"),
  async (req, res) => {
    try {

      const { id } = req.params;

      const [usuarios] = await db.query(
        "SELECT id_usuario, nombre, correo, rol, estado FROM usuario WHERE id_usuario = ?",
        [id]
      );

      if (usuarios.length === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      res.json(usuarios[0]);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al obtener usuario"
      });

    }
  }
);

// ==============================
// EDITAR USUARIO
// PUT /api/usuarios/:id
// ==============================
router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { nombre, rol } = req.body;

      if (!nombre || !rol) {
        return res.status(400).json({
          mensaje: "Nombre y rol son obligatorios"
        });
      }

      const [resultado] = await db.query(
        "UPDATE usuario SET nombre = ?, rol = ? WHERE id_usuario = ?",
        [nombre, rol, id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      if (!validarRol(rol)) {
        return res.status(400).json({
            mensaje: "Rol inválido"
        });
      }

      res.json({
        mensaje: "Usuario actualizado correctamente"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al actualizar usuario"
      });

    }

  }
);


// ==============================
// CAMBIAR ESTADO
// PATCH /api/usuarios/:id/estado
// ==============================
router.patch(
  "/:id/estado",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          mensaje: "El estado es obligatorio"
        });
      }

      if (!validarEstadoUsuario(estado)) {
        return res.status(400).json({
            mensaje: "Estado inválido"
        });
      }

      const [resultado] = await db.query(
        "UPDATE usuario SET estado = ? WHERE id_usuario = ?",
        [estado, id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      res.json({
        mensaje: "Estado actualizado"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al cambiar estado"
      });

    }

  }
);
module.exports = router;
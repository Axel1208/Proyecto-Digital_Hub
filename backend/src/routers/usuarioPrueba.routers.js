const express = require("express");
const router = express.Router();
const db = require("../db/database");

// =========================================
// RUTA DE PRUEBA
// =========================================
router.get("/test", (req, res) => {
    res.json({ mensaje: "funciona" });
});

// ==============================
// LOGIN (SIN SEGURIDAD)
// POST /api/usuarioprueba/login
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

        // SIN VALIDACIÓN DE ESTADO - puedes entrar aunque esté inactivo
        // const if (usuario.estado !== "activo") { ... }

        // Comparación simple SIN bcrypt
        if (password !== usuario.password_hash) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        // SIN TOKEN JWT - retorna los datos del usuario
        res.json({
            mensaje: "Login exitoso",
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
                estado: usuario.estado
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });

    }

});


// ==============================
// CREAR USUARIO (SIN SEGURIDAD)
// POST /api/usuarioprueba
// ==============================
router.post(
    "/",
    async (req, res) => {

        try {

            const { nombre, correo, password, rol, estado } = req.body;

            // Solo validación de campos obligatorios
            if (!nombre || !correo || !password || !rol || !estado) {
                return res.status(400).json({
                    mensaje: "Todos los campos son obligatorios"
                });
            }

            // SIN validarRol(), SIN validarCorreo(), SIN estadosValidos
            
            // Verificar si el correo ya existe
            const [existe] = await db.query(
                "SELECT id_usuario FROM usuario WHERE correo = ?",
                [correo]
            );

            if (existe.length > 0) {
                return res.status(400).json({
                    mensaje: "El correo ya existe"
                });
            }

            // SIN bcrypt.hash() - guardar password plano
            await db.query(
                "INSERT INTO usuario (nombre, correo, password_hash, rol, estado) VALUES (?, ?, ?, ?, ?)",
                [nombre, correo, password, rol, estado]
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
// LISTAR USUARIOS (SIN SEGURIDAD)
// GET /api/usuarioprueba
// ==============================
router.get(
    "/",
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
// OBTENER USUARIO POR ID (SIN SEGURIDAD)
// GET /api/usuarioprueba/:id
// ==============================

router.get(
  "/:id",
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
// EDITAR USUARIO (SIN SEGURIDAD)
// PUT /api/usuarioprueba/:id
// ==============================
router.put(
  "/:id",
  async (req, res) => {
    try {

      const { id } = req.params;
      const { nombre, rol, correo, estado } = req.body;

      // SIN validarRol()
      // SIN validarEstadoUsuario()
      // SIN validarCorreo()

      // Verificar correo duplicado (solo esa validación)
      if (correo) {

        const [correoExistente] = await db.query(
          "SELECT id_usuario FROM usuario WHERE correo = ?",
          [correo]
        );

        if (correoExistente.length > 0 && correoExistente[0].id_usuario != id) {
          return res.status(400).json({
            mensaje: "El correo ya está en uso"
          });
        }

      }

      // construir update dinámico
      const campos = [];
      const valores = [];

      if (nombre) {
        campos.push("nombre = ?");
        valores.push(nombre);
      }

      if (rol) {
        campos.push("rol = ?");
        valores.push(rol);
      }

      if (correo) {
        campos.push("correo = ?");
        valores.push(correo);
      }

      if (estado) {
        campos.push("estado = ?");
        valores.push(estado);
      }

      if (campos.length === 0) {
        return res.status(400).json({
          mensaje: "No se enviaron campos para actualizar"
        });
      }

      valores.push(id);

      const [resultado] = await db.query(
        `UPDATE usuario SET ${campos.join(", ")} WHERE id_usuario = ?`,
        valores
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
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
// ELIMINAR USUARIO (NUEVO - SIN SEGURIDAD)
// DELETE /api/usuarioprueba/:id
// ==============================
router.delete(
  "/:id",
  async (req, res) => {
    try {

      const { id } = req.params;

      const [resultado] = await db.query(
        "DELETE FROM usuario WHERE id_usuario = ?",
        [id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      res.json({
        mensaje: "Usuario eliminado correctamente"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al eliminar usuario"
      });

    }
  }
);

// ==============================
// CAMBIAR ESTADO (SIN SEGURIDAD)
// PATCH /api/usuarioprueba/:id/estado
// ==============================
router.patch(
  "/:id/estado",
  async (req, res) => {

    try {

      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          mensaje: "El estado es obligatorio"
        });
      }

      // SIN validarEstadoUsuario()

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
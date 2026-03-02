const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/database");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

// Roles oficiales del sistema
const rolesValidos = ["administrador", "instructor", "aprendiz"];


// =============================
// LOGIN
// =============================
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
        }

        const [usuarios] = await db.query(
            "SELECT * FROM usuario WHERE correo = ? AND estado = 'activo'",
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado o inactivo" });
        }

        const usuario = usuarios[0];

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ mensaje: "Login exitoso", token });

    } catch (error) {
        res.status(500).json({ error: "Error en login" });
    }
});


// =============================
// CREAR USUARIO (admin e instructor)
// =============================
router.post("/usuarios",
    verificarToken,
    verificarRol("administrador", "instructor"),
    async (req, res) => {

        try {
            const { nombre, correo, password, rol } = req.body;

            if (!nombre || !correo || !password || !rol) {
                return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
            }

            if (!rolesValidos.includes(rol)) {
                return res.status(400).json({ mensaje: "Rol inválido" });
            }

            // 🔒 BLOQUEO DE ESCALAMIENTO
            if (req.usuario.rol === "instructor" && rol === "administrador") {
                return res.status(403).json({
                    mensaje: "No tienes permiso para crear administradores"
                });
            }

            const [existeCorreo] = await db.query(
                "SELECT * FROM usuario WHERE correo = ?",
                [correo]
            );

            if (existeCorreo.length > 0) {
                return res.status(400).json({ mensaje: "Correo ya registrado" });
            }

            const password_hash = await bcrypt.hash(password, 10);

            await db.query(
                "INSERT INTO usuario (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)",
                [nombre, correo, password_hash, rol]
            );

            res.status(201).json({ mensaje: "Usuario creado correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al crear usuario" });
        }
    }
);


// =============================
// LISTAR USUARIOS (admin e instructor)
// =============================
router.get("/usuarios",
    verificarToken,
    verificarRol("administrador", "instructor"),
    async (req, res) => {
        try {
            const [usuarios] = await db.query(
                "SELECT id_usuario, nombre, correo, rol, estado FROM usuario"
            );

            res.json(usuarios);

        } catch (error) {
            res.status(500).json({ error: "Error al listar usuarios" });
        }
    }
);


// =============================
// EDITAR USUARIO (solo admin)
// =============================
router.put("/usuarios/:id",
    verificarToken,
    verificarRol("administrador"),
    async (req, res) => {

        try {
            const { id } = req.params;
            const { nombre, rol } = req.body;

            if (!nombre || !rol) {
                return res.status(400).json({ mensaje: "Nombre y rol son obligatorios" });
            }

            if (!rolesValidos.includes(rol)) {
                return res.status(400).json({ mensaje: "Rol inválido" });
            }

            await db.query(
                "UPDATE usuario SET nombre = ?, rol = ? WHERE id_usuario = ?",
                [nombre, rol, id]
            );

            res.json({ mensaje: "Usuario actualizado correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al actualizar usuario" });
        }
    }
);


// =============================
// DESACTIVAR USUARIO (solo admin)
// =============================
router.patch("/usuarios/:id",
    verificarToken,
    verificarRol("administrador"),
    async (req, res) => {

        try {
            const { id } = req.params;

            // 🔒 Evitar que admin se desactive a sí mismo
            if (req.usuario.id == id) {
                return res.status(400).json({
                    mensaje: "No puedes desactivarte a ti mismo"
                });
            }

            await db.query(
                "UPDATE usuario SET estado = 'inactivo' WHERE id_usuario = ?",
                [id]
            );

            res.json({ mensaje: "Usuario desactivado correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al desactivar usuario" });
        }
    }
);

module.exports = router;
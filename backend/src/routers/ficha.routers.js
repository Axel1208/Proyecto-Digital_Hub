const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");
const {
  validarFichaActiva,
  validarCupoMaximo,
  validarAprendizNoRepetido
} = require("../middlewares/fichaValidations");
const fichaController = require("../controllers/ficha.controller");
const { ROLES } = require("../constants/dominio");

// Listar fichas y obtener ficha por id (público autenticado)
router.get("/", verificarToken, fichaController.obtenerFichas);

// GET /mia - ficha del aprendiz logueado (debe ir antes de /:id)
router.get("/mia", verificarToken, verificarRol(ROLES.APRENDIZ), async (req, res) => {
  try {
    const pool = require("../db/database");
    const id_aprendiz = req.usuario.id;
    const [rows] = await pool.query(
      `SELECT f.* FROM ficha f
       JOIN ficha_aprendiz fa ON fa.id_ficha = f.id_ficha
       WHERE fa.id_aprendiz = ?`,
      [id_aprendiz]
    );
    res.json(rows[0] || null);
  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener tu ficha" });
  }
});

router.get("/:id", verificarToken, fichaController.obtenerFichaPorId);

// Instructor: crear, modificar, eliminar fichas
router.post(
  "/",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "programa_formacion", "jornada", "cupo_maximo"]),
  fichaController.crearFicha
);

router.put(
  "/:id",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "programa_formacion", "jornada", "cupo_maximo", "estado"]),
  fichaController.modificarFicha
);

router.delete(
  "/:id",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  fichaController.eliminarFicha
);

// Aprendiz: unirse a ficha con validaciones de cupo, estado y duplicado
router.post(
  "/:id/unirse",
  verificarToken,
  verificarRol(ROLES.APRENDIZ),
  validarFichaActiva,
  validarCupoMaximo,
  validarAprendizNoRepetido,
  fichaController.unirseFicha
);

// Instructor: asignar aprendiz por correo a ficha
router.post(
  "/:id/asignar",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarFichaActiva,
  validarCupoMaximo,
  fichaController.asignarAprendiz
);

// =============================
// GET aprendices de una ficha
// =============================
router.get("/:id/aprendices", verificarToken, verificarRol(ROLES.INSTRUCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    const pool = require("../db/database");
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.estado, fa.fecha_union
       FROM ficha_aprendiz fa
       JOIN usuario u ON fa.id_aprendiz = u.id_usuario
       WHERE fa.id_ficha = ?`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener aprendices" });
  }
});

// =============================
// GET portatiles asignados a una ficha
// =============================
router.get("/:id/portatiles", verificarToken, verificarRol(ROLES.INSTRUCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    const pool = require("../db/database");
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.id_portatil, p.num_serie, p.marca, p.tipo, p.modelo, p.estado
       FROM asignacion a
       JOIN portatil p ON a.id_portatil = p.id_portatil
       WHERE a.id_ficha = ?`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener portatiles" });
  }
});

// =============================
// GET reportes de aprendices de una ficha
// =============================
router.get("/:id/reportes", verificarToken, verificarRol(ROLES.INSTRUCTOR, ROLES.ADMIN), async (req, res) => {
  try {
    const pool = require("../db/database");
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT r.id_reporte, r.descripcion, r.estado_reporte, r.fecha_reporte, u.nombre AS aprendiz
       FROM reportes r
       JOIN usuario u ON r.id_usuario = u.id_usuario
       JOIN ficha_aprendiz fa ON fa.id_aprendiz = u.id_usuario
       WHERE fa.id_ficha = ?`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener reportes" });
  }
});

module.exports = router;
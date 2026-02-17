const express = require("express");
const router = express.Router();

const pool = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

// ============================================
// CREAR PORTÁTIL
// ============================================
router.post(
  "/",
  validarCamposObligatorios([
    "id_portatil",
    "marca",
    "tipo",
    "modelo",
    "estado",
    "num_serie",
    "ubicacion",
    "descripcion"
  ]),
  async (req, res) => {
    try {
      const { id_portatil, marca, tipo, modelo, estado, num_serie, ubicacion, descripcion } = req.body;

      // Verificar si ya existe un portátil con el mismo ID
      const [existe] = await pool.query(
        "SELECT id_portatil FROM portatil WHERE id_portatil = ?",
        [id_portatil]
      );

      if (existe.length > 0) {
        return res.status(400).json({ mensaje: "Ya existe un portátil con ese ID" });
      }

      await pool.query(
        `INSERT INTO portatil 
        (id_portatil, marca, tipo, modelo, estado, num_serie, ubicacion, descripcion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_portatil, marca, tipo, modelo, estado, num_serie, ubicacion, descripcion]
      );

      res.status(201).json({
        mensaje: "Portátil creado correctamente"
      });
    } catch (error) {
      console.error("❌ Error al crear portátil:", error);
      res.status(500).json({
        mensaje: "Error al crear el portátil",
        error: error.message
      });
    }
  }
);

// ============================================
// ACTUALIZAR PORTÁTIL
// ============================================
router.put(
  "/:id",
  validarCamposObligatorios([
    "marca",
    "tipo",
    "modelo",
    "estado",
    "num_serie",
    "ubicacion",
    "descripcion"
  ]),
  async (req, res) => {
    try {
      const { marca, tipo, modelo, estado, num_serie, ubicacion, descripcion } = req.body;
      const { id } = req.params;

      const [resultado] = await pool.query(
        `UPDATE portatil 
         SET marca = ?, tipo = ?, modelo = ?, estado = ?, num_serie = ?, ubicacion = ?, descripcion = ? 
         WHERE id_portatil = ?`,
        [marca, tipo, modelo, estado, num_serie, ubicacion, descripcion, id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Portátil no encontrado" });
      }

      res.json({
        mensaje: "Portátil actualizado correctamente"
      });
    } catch (error) {
      console.error("❌ Error al actualizar portátil:", error);
      res.status(500).json({
        mensaje: "Error al actualizar el portátil",
        error: error.message
      });
    }
  }
);

// ============================================
// LISTAR TODOS LOS PORTÁTILES
// ============================================
router.get("/", async (req, res) => {
  try {
    const [portatiles] = await pool.query("SELECT * FROM portatil");
    res.json(portatiles);
  } catch (error) {
    console.error("❌ Error al listar portátiles:", error);
    res.status(500).json({ mensaje: "Error al listar portátiles", error: error.message });
  }
});

// ============================================
// LISTAR PORTÁTIL POR ID
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [portatil] = await pool.query("SELECT * FROM portatil WHERE id_portatil = ?", [id]);

    if (portatil.length === 0) {
      return res.status(404).json({ mensaje: "Portátil no encontrado" });
    }

    res.json(portatil[0]);
  } catch (error) {
    console.error("❌ Error al obtener portátil:", error);
    res.status(500).json({ mensaje: "Error al obtener portátil", error: error.message });
  }
});

// ============================================
// ELIMINAR PORTÁTIL
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query("DELETE FROM portatil WHERE id_portatil = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Portátil no encontrado" });
    }

    res.json({ mensaje: "Portátil eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar portátil:", error);
    res.status(500).json({ mensaje: "Error al eliminar portátil", error: error.message });
  }
});

// ============================================
// EXPORTAR RUTAS
// ============================================
module.exports = router;

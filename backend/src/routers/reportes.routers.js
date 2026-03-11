const express = require("express");
const router = express.Router();
const pool = require("../db/database");

/**
 * GET - Obtener todos los reportes
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reportes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener reportes" });
  }
});

/**
 * GET - Obtener reporte por ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM reportes WHERE id_reporte = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el reporte" });
  }
});

/**
 * POST - Crear reporte
 */
router.post("/", async (req, res) => {
  try {
    const {
      estado_reporte,
      fecha_reporte,
      archivo,
      descripcion
    } = req.body || {};

    if (!estado_reporte || !fecha_reporte || !archivo || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO reportes 
      (estado_reporte, fecha_reporte, archivo, descripcion)
      VALUES (?, ?, ?, ?)`,
      [estado_reporte, fecha_reporte, archivo, descripcion]
    );

    res.status(201).json({ message: "Reporte creado correctamente" });
  } catch (error) {
    console.error("MYSQL ERROR >>>", error);
    res.status(500).json({ message: "Error al crear reporte" });
  }
});

/**
 * PUT - Actualizar reporte
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estado_reporte,
      fecha_reporte,
      archivo,
      descripcion
    } = req.body || {};

    if (!estado_reporte || !fecha_reporte || !archivo || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [result] = await pool.query(
      `UPDATE reportes SET
        estado_reporte = ?,
        fecha_reporte = ?,
        archivo = ?,
        descripcion = ?
       WHERE id_reporte = ?`,
      [estado_reporte, fecha_reporte, archivo, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar reporte" });
  }
});

/**
 * DELETE - Eliminar reporte
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM reportes WHERE id_reporte = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error al eliminar reporte" });
  }
});

module.exports = router;

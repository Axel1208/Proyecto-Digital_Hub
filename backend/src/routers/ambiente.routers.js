const express = require("express");
const router = express.Router();
const pool = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

/**
 * GET - Obtener todos los ambientes
 * (Solo lectura, no RF31)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ambiente");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener ambientes:", error);
    res.status(500).json({ message: "Error al obtener ambientes" });
  }
});

/**
 * GET - Obtener ambiente por ID
 * (Solo lectura)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM ambiente WHERE id_ambiente = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Ambiente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener ambiente:", error);
    res.status(500).json({ message: "Error al obtener ambiente" });
  }
});

/**
 * POST - Crear ambiente
 * RF31 aplicado
 */
router.post(
  "/",
  validarCamposObligatorios([
    "nombre",
    "direccion"
  ]),
  async (req, res) => {
    try {
      const { nombre, direccion } = req.body;

      await pool.query(
        `INSERT INTO ambiente (nombre, direccion)
         VALUES (?, ?)`,
        [nombre, direccion]
      );

      res.status(201).json({
        message: "Ambiente creado correctamente"
      });
    } catch (error) {
      console.error("Error al crear ambiente:", error);
      res.status(500).json({
        message: "Error al crear ambiente"
      });
    }
  }
);

/**
 * PUT - Actualizar ambiente
 * RF31 aplicado
 */
router.put(
  "/:id",
  validarCamposObligatorios([
    "nombre",
    "direccion"
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, direccion } = req.body;

      const [result] = await pool.query(
        `UPDATE ambiente SET
          nombre = ?,
          direccion = ?
         WHERE id_ambiente = ?`,
        [nombre, direccion, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Ambiente no encontrado"
        });
      }

      res.json({
        message: "Ambiente actualizado correctamente"
      });
    } catch (error) {
      console.error("Error al actualizar ambiente:", error);
      res.status(500).json({
        message: "Error al actualizar ambiente"
      });
    }
  }
);

/**
 * DELETE - Eliminar ambiente
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM ambiente WHERE id_ambiente = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ambiente no encontrado" });
    }

    res.json({
      message: "Ambiente eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar ambiente:", error);
    res.status(500).json({
      message: "Error al eliminar ambiente"
    });
  }
});

module.exports = router;
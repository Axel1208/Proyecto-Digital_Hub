const express = require("express");
const router = express.Router();
const pool = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

/**
 * GET - Obtener todas las fichas
 * (Solo lectura)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ficha");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en GET /ficha:", error);
    res.status(500).json({ message: "Error al obtener fichas" });
  }
});

/**
 * GET - Obtener ficha por ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM ficha WHERE id_ficha = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Ficha no encontrada" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error en GET /ficha/:id:", error);
    res.status(500).json({ message: "Error al obtener ficha" });
  }
});

/**
 * POST - Crear ficha
 * RF31 aplicado
 */
router.post(
  "/",
  validarCamposObligatorios([
    "id_ficha",
    "programa_formacion",
    "jornada"
  ]),
  async (req, res) => {
    try {
      const { id_ficha, programa_formacion, jornada } = req.body;

      // Validar si ya existe la ficha
      const [existe] = await pool.query(
        "SELECT id_ficha FROM ficha WHERE id_ficha = ?",
        [id_ficha]
      );

      if (existe.length > 0) {
        return res.status(409).json({
          message: "La ficha ya se encuentra registrada"
        });
      }

      await pool.query(
        `INSERT INTO ficha (id_ficha, programa_formacion, jornada)
         VALUES (?, ?, ?)`,
        [id_ficha, programa_formacion, jornada]
      );

      res.status(201).json({
        message: "Ficha creada correctamente"
      });
    } catch (error) {
      console.error("Error en POST /ficha:", error);
      res.status(500).json({
        message: "Error al crear ficha"
      });
    }
  }
);

/**
 * PUT - Actualizar ficha
 * RF31 aplicado
 */
router.put(
  "/:id",
  validarCamposObligatorios([
    "programa_formacion",
    "jornada"
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { programa_formacion, jornada } = req.body;

      const [result] = await pool.query(
        `UPDATE ficha SET
          programa_formacion = ?,
          jornada = ?
         WHERE id_ficha = ?`,
        [programa_formacion, jornada, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Ficha no encontrada"
        });
      }

      res.status(200).json({
        message: "Ficha actualizada correctamente"
      });
    } catch (error) {
      console.error("Error en PUT /ficha:", error);
      res.status(500).json({
        message: "Error al actualizar ficha"
      });
    }
  }
);

/**
 * DELETE - Eliminar ficha
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM ficha WHERE id_ficha = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ficha no encontrada" });
    }

    res.status(200).json({
      message: "Ficha eliminada correctamente"
    });
  } catch (error) {
    console.error("Error en DELETE /ficha:", error);
    res.status(500).json({
      message: "Error al eliminar ficha"
    });
  }
});

module.exports = router;
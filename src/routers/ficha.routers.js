const express = require("express");
const router = express.Router();
const pool = require("../db/database");


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ficha");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en GET /ficha:", error);
    res.status(500).json({ message: "Error al obtener ficha", error: error.message });
  }
});

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
    res.status(500).json({ message: "Error al obtener ficha", error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "El body no puede estar vacío" });
    }

    const fields = Object.keys(body);
    const values = Object.values(body);
    const placeholders = fields.map(() => "?").join(", ");

    await pool.query(
      `INSERT INTO ficha (${fields.join(", ")}) VALUES (${placeholders})`,
      values
    );

    res.status(201).json({ message: "Ficha creada correctamente" });
  } catch (error) {
    console.error("Error en POST /ficha:", error);
    res.status(500).json({ message: "Error al crear ficha", error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "El body no puede estar vacío" });
    }

    const fields = Object.keys(body);
    const values = Object.values(body);
    const setClause = fields.map(field => `${field} = ?`).join(", ");

    const [result] = await pool.query(
      `UPDATE ficha SET ${setClause} WHERE id_ficha = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ficha no encontrada" });
    }

    res.status(200).json({ message: "Ficha actualizada correctamente" });
  } catch (error) {
    console.error("Error en PUT /ficha/:id:", error);
    res.status(500).json({ message: "Error al actualizar ficha", error: error.message });
  }
});


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

    return res.status(200).json({
      message: "Ficha eliminada correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la ficha",
      error: error.message
    });
  }
});

module.exports = router;

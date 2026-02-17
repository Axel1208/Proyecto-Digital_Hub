const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Obtener todos los ambientes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ambiente");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ambientes", error: error.message });
  }
});

// Obtener un ambiente por ID
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
    console.error(error);
    res.status(500).json({ message: "Error al obtener ambiente", error: error.message });
  }
});

// Crear un nuevo ambiente
router.post("/", async (req, res) => {
  try {
    const body = req.body || {}; 
    const {
      nombre,
      direccion
    } = body;

    // Validar campos obligatorios
    if (!nombre || !direccion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO ambiente
      (nombre, direccion)
      VALUES (?, ?)`,
      [
        nombre,
        direccion
      ]
    );

    res.status(201).json({ message: "Ambiente creado correctamente" });
  } catch (error) {
    console.error("ERROR MYSQL >>>", error);
    res.status(500).json({ message: "Error al crear ambiente", error: error.message });
  }
});

// Actualizar un ambiente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {}; 
    const {
      nombre,
      direccion
    } = body;

    // Validar campos obligatorios
    if (!nombre || !direccion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [result] = await pool.query(
      `UPDATE ambiente SET
        nombre = ?,
        direccion = ?
       WHERE id_ambiente = ?`,
      [nombre, direccion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ambiente no encontrado" });
    }

    res.json({ message: "Ambiente actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar ambiente", error: error.message });
  }
});

// Eliminar un ambiente
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

    res.json({ message: "Ambiente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar ambiente", error: error.message });
  }
});

module.exports = router;

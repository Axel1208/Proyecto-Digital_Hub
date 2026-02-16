const express = require("express");
const router = express.Router();
const pool = require("../db/database");


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM portatil");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener portátiles" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM portatil WHERE id_portatil = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Portátil no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener portátil" });
  }
});


router.post("/", async (req, res) => {
  try {
    const body = req.body || {}; 
    const {
      marca,
      tipo,
      modelo,
      estado,
      num_serie,
      ubicacion,
      descripcion
    } = body;

   
    if (!marca || !tipo || !modelo || !estado || !num_serie) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO portatil
      (marca, tipo, modelo, estado, num_serie, ubicacion, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        marca,
        tipo,
        modelo,
        estado,
        num_serie,
        ubicacion ?? null,
        descripcion ?? null
      ]
    );

    res.status(201).json({ message: "Portátil creado correctamente" });
  } catch (error) {
    console.error("ERROR MYSQL >>>", error);
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {}; 
    const {
      marca,
      tipo,
      modelo,
      estado,
      num_serie,
      ubicacion,
      descripcion
    } = body;

    
    if (!marca || !tipo || !modelo || !estado || !num_serie) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [result] = await pool.query(
      `UPDATE portatil SET
        marca = ?,
        tipo = ?,
        modelo = ?,
        estado = ?,
        num_serie = ?,
        ubicacion = ?,
        descripcion = ?
       WHERE id_portatil = ?`,
      [marca, tipo, modelo, estado, num_serie, ubicacion ?? null, descripcion ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Portátil no encontrado" });
    }

    res.json({ message: "Portátil actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar portátil" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM portatil WHERE id_portatil = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Portátil no encontrado" });
    }

    res.json({ message: "Portátil eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar portátil" });
  }
});

module.exports = router;

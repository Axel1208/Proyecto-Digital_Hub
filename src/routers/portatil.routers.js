const express = require("express");
const router = express.Router();
const pool = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

/**
 * GET - Obtener todos los portátiles
 * (Solo lectura)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM portatil");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener portátiles:", error);
    res.status(500).json({ message: "Error al obtener portátiles" });
  }
});

/**
 * GET - Obtener portátil por ID
 */
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

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener portátil:", error);
    res.status(500).json({ message: "Error al obtener portátil" });
  }
});

/**
 * POST - Crear portátil
 * RF31 aplicado
 */
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
      const {
        id_portatil,
        marca,
        tipo,
        modelo,
        estado,
        num_serie,
        ubicacion,
        descripcion
      } = req.body;

      // Validar si ya existe el portátil
      const [existe] = await pool.query(
        "SELECT id_portatil FROM portatil WHERE id_portatil = ?",
        [id_portatil]
      );

      if (existe.length > 0) {
        return res.status(409).json({
          message: "El portátil ya se encuentra registrado"
        });
      }

      await pool.query(
        `INSERT INTO portatil
         (id_portatil, marca, tipo, modelo, estado, num_serie, ubicacion, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_portatil,
          marca,
          tipo,
          modelo,
          estado,
          num_serie,
          ubicacion,
          descripcion
        ]
      );

      res.status(201).json({
        message: "Portátil creado correctamente"
      });
    } catch (error) {
      console.error("Error al crear portátil:", error);
      res.status(500).json({
        message: "Error al crear el portátil"
      });
    }
  }
);

/**
 * PUT - Actualizar portátil
 * RF31 aplicado
 */
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
      const { id } = req.params;
      const {
        marca,
        tipo,
        modelo,
        estado,
        num_serie,
        ubicacion,
        descripcion
      } = req.body;

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
        [
          marca,
          tipo,
          modelo,
          estado,
          num_serie,
          ubicacion,
          descripcion,
          id
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Portátil no encontrado"
        });
      }

      res.status(200).json({
        message: "Portátil actualizado correctamente"
      });
    } catch (error) {
      console.error("Error al actualizar portátil:", error);
      res.status(500).json({
        message: "Error al actualizar el portátil"
      });
    }
  }
);

/**
 * DELETE - Eliminar portátil
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM portatil WHERE id_portatil = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Portátil no encontrado"
      });
    }

    res.status(200).json({
      message: "Portátil eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar portátil:", error);
    res.status(500).json({
      message: "Error al eliminar portátil"
    });
  }
});

module.exports = router;
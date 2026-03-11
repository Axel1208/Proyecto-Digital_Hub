const express = require("express");
const router = express.Router();
const pool = require("../db/database");

const validarPortatilNoDanado = require("../middlewares/validarPortatilNoDanado");
const actualizarEstadoPortatil = require("../middlewares/actualizarEstadoPortatil");

/**
 * ASIGNAR PORTÁTIL
 */
router.post(
  "/",
  validarPortatilNoDanado,
  actualizarEstadoPortatil,
  async (req, res) => {
    try {
      const { id_portatil, id_ficha } = req.body;

      await pool.query(
        "INSERT INTO asignacion (id_portatil, id_ficha) VALUES (?, ?)",
        [id_portatil, id_ficha]
      );

      res.status(201).json({
        message: "Portátil asignado correctamente"
      });

    } catch (error) {
      res.status(500).json({
        message: "Error al asignar portátil",
        error: error.message
      });
    }
  }
);

module.exports = router;
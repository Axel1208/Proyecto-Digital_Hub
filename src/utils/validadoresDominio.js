const express = require("express");
const router = express.Router();

const pool = require("../db/database");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");

/**
 * CREAR PORTÁTIL
 * RF31 aplicado
 */
router.post(
  "/",
  validarCamposObligatorios(["id_portatil", "estado", "ambiente"]),
  async (req, res) => {
    try {
      const { id_portatil, estado, ambiente } = req.body;

      const [existe] = await pool.query(
        "SELECT id_portatil FROM portatil WHERE id_portatil = ?",
        [id_portatil]
      );

      if (existe.length > 0) {
        return res.status(409).json({
          mensaje: "El portátil ya se encuentra registrado"
        });
      }

      await pool.query(
        "INSERT INTO portatil (id_portatil, estado, ambiente) VALUES (?, ?, ?)",
        [id_portatil, estado, ambiente]
      );

      res.status(201).json({
        mensaje: "Portátil creado correctamente"
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al crear el portátil"
      });
    }
  }
);

/**
 * ACTUALIZAR PORTÁTIL
 * RF31 aplicado
 */
router.put(
  "/:id",
  validarCamposObligatorios(["estado", "ambiente"]),
  async (req, res) => {
    try {
      const { estado, ambiente } = req.body;
      const { id } = req.params;

      await pool.query(
        "UPDATE portatil SET estado = ?, ambiente = ? WHERE id_portatil = ?",
        [estado, ambiente, id]
      );

      res.json({
        mensaje: "Portátil actualizado correctamente"
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al actualizar el portátil"
      });
    }
  }
);

/**
 * LISTAR PORTÁTILES
 * SOLO LECTURA (NO RF31)
 */
router.get("/", async (req, res) => {
  try {
    const [portatiles] = await pool.query(
      "SELECT id_portatil, estado, ambiente FROM portatil"
    );

    res.json(portatiles);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los portátiles"
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Middlewares
const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");
const validarSerialUnico = require("../middlewares/validarSerialUnico");

/*
=========================================
1. CREAR PORTÁTIL
=========================================
(Seguridad temporalmente desactivada)
*/

router.post(
  "/",
  validarCamposObligatorios(["num_serie", "marca", "modelo", "estado", "ubicacion", "descripcion"]),
  validarSerialUnico,
  async (req, res) => {
    try {
      const { num_serie, marca, modelo, estado, ubicacion, descripcion } = req.body;

      const [resultado] = await pool.query(
        `INSERT INTO portatil (num_serie, marca, modelo, estado, ubicacion, descripcion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [num_serie, marca, modelo, estado, ubicacion, descripcion]
      );

      res.status(201).json({
        mensaje: "Portátil registrado correctamente",
        id_portatil: resultado.insertId
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al registrar el portátil"
      });
    }
  }
);

/*
=========================================
2. LISTAR TODOS LOS PORTÁTILES
=========================================
(Seguridad temporalmente desactivada)
*/

router.get(
  "/",
  async (req, res) => {
    try {

      const [rows] = await pool.query(
        "SELECT * FROM portatil"
      );

      res.json(rows);

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al obtener los portátiles"
      });
    }
  }
);

/*
=========================================
3. OBTENER PORTÁTIL POR ID
=========================================
(Seguridad temporalmente desactivada)
*/

router.get(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const [rows] = await pool.query(
        "SELECT * FROM portatil WHERE id_portatil = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          mensaje: "Portátil no encontrado"
        });
      }

      res.json(rows[0]);

    } catch (error) {

      res.status(500).json({
        mensaje: "Error al obtener el portátil"
      });

    }

  }
);

/*
=========================================
4. ACTUALIZAR PORTÁTIL
=========================================
(Seguridad temporalmente desactivada)
*/

router.put(
  "/:id",
  validarCamposObligatorios(["marca", "modelo", "estado", "ubicacion", "descripcion"]),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { marca, modelo, estado, ubicacion, descripcion } = req.body;

      const [resultado] = await pool.query(
        `UPDATE portatil
         SET marca = ?, modelo = ?, estado = ?, ubicacion = ?, descripcion = ?
         WHERE id_portatil = ?`,
        [marca, modelo, estado, ubicacion, descripcion, id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Portátil no encontrado"
        });
      }

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

/*
=========================================
5. ELIMINAR PORTÁTIL
=========================================
(Seguridad temporalmente desactivada)
*/

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const [resultado] = await pool.query(
        "DELETE FROM portatil WHERE id_portatil = ?",
        [id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Portátil no encontrado"
        });
      }

      res.json({
        mensaje: "Portátil eliminado correctamente"
      });

    } catch (error) {

      res.status(500).json({
        mensaje: "Error al eliminar el portátil"
      });

    }

  }
);

module.exports = router;
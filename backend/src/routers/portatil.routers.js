const express = require("express");
const router = express.Router();
const pool = require("../db/database");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");
const validarSerialUnico = require("../middlewares/validarSerialUnico");


/*
=========================================
1. CREAR PORTÁTIL
=========================================
Solo ADMIN o INSTRUCTOR
*/

router.post(
  "/",
  verificarToken,
  verificarRol("administrador", "instructor"),
  validarCamposObligatorios(["num_serie", "marca", "tipo", "modelo", "estado"]),
  validarSerialUnico,
  async (req, res) => {
    try {
      const { num_serie, marca, tipo, modelo, estado, ubicacion, descripcion } = req.body;

      const [resultado] = await pool.query(
        `INSERT INTO portatil (num_serie, marca, tipo, modelo, estado, ubicacion, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [num_serie, marca, tipo, modelo, estado, ubicacion || null, descripcion || null]
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
*/

router.get(
  "/",
  verificarToken,
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
*/

router.get(
  "/:id",
  verificarToken,
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
Solo ADMIN o INSTRUCTOR
*/

router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador", "instructor"),
  validarCamposObligatorios(["marca", "tipo", "modelo", "estado"]),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { marca, tipo, modelo, estado, ubicacion, descripcion } = req.body;

      const [resultado] = await pool.query(
        `UPDATE portatil
         SET marca = ?, tipo = ?, modelo = ?, estado = ?, ubicacion = ?, descripcion = ?
         WHERE id_portatil = ?`,
        [marca, tipo, modelo, estado, ubicacion || null, descripcion || null, id]
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
Solo ADMIN
*/

router.delete(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
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

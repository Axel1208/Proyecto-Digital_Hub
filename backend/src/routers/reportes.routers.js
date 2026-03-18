const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// 📊 Controlador de Excel
const { exportarReportesExcel } = require("../controllers/reportes.controller");

// 📸 Middleware para subida de archivos
const upload = require("../uploads/upload");

// =============================
// 📥 EXPORTAR EXCEL
// =============================
router.get("/excel", exportarReportesExcel);

// =============================
// 📄 GET - Obtener todos los reportes
// =============================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reportes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener reportes" });
  }
});

// =============================
// 🔍 GET - Obtener reporte por ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM reportes WHERE id_reporte = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el reporte" });
  }
});

// =============================
// ➕ POST - Crear reporte (con imagen)
// =============================
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const {
      estado_reporte,
      fecha_reporte,
      descripcion
    } = req.body;

    // Validación básica
    if (!estado_reporte || !fecha_reporte || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // 📸 Ruta de la imagen
    const archivo = req.file ? req.file.path : null;

    await pool.query(
      `INSERT INTO reportes 
      (estado_reporte, fecha_reporte, archivo, descripcion)
      VALUES (?, ?, ?, ?)`,
      [estado_reporte, fecha_reporte, archivo, descripcion]
    );

    res.status(201).json({ message: "Reporte creado correctamente" });

  } catch (error) {
    console.error("ERROR POST >>>", error);
    res.status(500).json({ message: "Error al crear reporte" });
  }
});

// =============================
// ✏️ PUT - Actualizar reporte (con o sin imagen)
// =============================
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estado_reporte,
      fecha_reporte,
      descripcion
    } = req.body;

    if (!estado_reporte || !fecha_reporte || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Mantener imagen anterior si no se envía nueva
    let archivo = req.body.archivo;

    if (req.file) {
      archivo = req.file.path;
    }

    const [result] = await pool.query(
      `UPDATE reportes SET
        estado_reporte = ?,
        fecha_reporte = ?,
        archivo = ?,
        descripcion = ?
       WHERE id_reporte = ?`,
      [estado_reporte, fecha_reporte, archivo, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte actualizado correctamente" });

  } catch (error) {
    console.error("ERROR PUT >>>", error);
    res.status(500).json({ message: "Error al actualizar reporte" });
  }
});

// =============================
// ❌ DELETE - Eliminar reporte
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM reportes WHERE id_reporte = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });

  } catch (error) {
    console.error("ERROR DELETE >>>", error);
    res.status(500).json({ message: "Error al eliminar reporte" });
  }
});

module.exports = router;
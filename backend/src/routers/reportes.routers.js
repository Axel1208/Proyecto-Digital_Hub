const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// 📊 Excel
const { exportarReportesExcel } = require("../controllers/reportes.controller");

// 🔐 Seguridad
const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

// 📸 Upload
const upload = require("../middlewares/upload");

// 📦 Constantes
const { ROLES } = require("../constants/dominio");

// =============================
// 📥 EXPORTAR EXCEL (ADMIN + INSTRUCTOR)
// =============================
router.get(
  "/excel",
  verificarToken,
  verificarRol(ROLES.ADMIN, ROLES.INSTRUCTOR),
  exportarReportesExcel
);

// =============================
// 📄 GET - Todos (protegido)
// =============================
router.get("/", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reportes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes" });
  }
});

// =============================
// 🔍 GET - Por ID (con validación)
// =============================
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ VALIDACIÓN 1: ID numérico
    if (isNaN(id)) {
      return res.status(400).json({
        message: "El ID debe ser numérico"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM reportes WHERE id_reporte = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener el reporte" });
  }
});

// =============================
// ➕ POST - SOLO APRENDIZ (VALIDACIONES COMPLETAS)
// =============================
router.post(
  "/",
  verificarToken,
  verificarRol(ROLES.APRENDIZ),
  upload.single("archivo"),
  async (req, res) => {
    try {
      let { estado_reporte, fecha_reporte, descripcion } = req.body;

      const { ESTADOS_REPORTE } = require("../constants/dominio");

      // ✅ VALIDACIÓN 4: Sanitización
      estado_reporte = estado_reporte?.trim();
      descripcion = descripcion?.trim();

      // ✅ Campos obligatorios
      if (!estado_reporte || !fecha_reporte || !descripcion) {
        return res.status(400).json({
          message: "Faltan campos obligatorios"
        });
      }

      // ✅ VALIDAR estado
      if (!ESTADOS_REPORTE.includes(estado_reporte)) {
        return res.status(400).json({
          message: "Estado de reporte inválido",
          estados_validos: ESTADOS_REPORTE
        });
      }

      // ✅ VALIDAR fecha
      const fecha = new Date(fecha_reporte);
      if (
        isNaN(fecha.getTime()) ||
        fecha.getFullYear() < 2000 ||
        fecha > new Date()
      ) {
        return res.status(400).json({
          message: "Fecha no válida"
        });
      }

      // ✅ VALIDACIÓN 2: Longitud descripción
      if (descripcion.length > 255) {
        return res.status(400).json({
          message: "La descripción es demasiado larga (máx 255 caracteres)"
        });
      }

      // ✅ VALIDACIÓN 3: Archivo (tipo y tamaño)
      if (req.file) {
        const tiposPermitidos = ["image/jpeg", "image/png"];

        if (!tiposPermitidos.includes(req.file.mimetype)) {
          return res.status(400).json({
            message: "Tipo de archivo no permitido (solo JPG y PNG)"
          });
        }

        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            message: "El archivo supera el tamaño permitido (5MB)"
          });
        }
      }

      const archivo = req.file ? req.file.path : null;

      await pool.query(
        `INSERT INTO reportes 
        (estado_reporte, fecha_reporte, archivo, descripcion)
        VALUES (?, ?, ?, ?)`,
        [estado_reporte, fecha_reporte, archivo, descripcion]
      );

      res.status(201).json({
        message: "Reporte creado correctamente"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al crear reporte"
      });
    }
  }
);

module.exports = router;

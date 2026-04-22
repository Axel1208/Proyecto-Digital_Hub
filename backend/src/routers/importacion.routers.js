const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const { ROLES } = require("../constants/dominio");
const { importarPortatiles, importarUsuarios, importarAmbientes, importarReportes } = require("../services/importacion.service");

const manejarImportacion = (func) => async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No se envió archivo" });
        const resultado = await func(req.file.path);
        res.json(resultado);
    } catch (error) {
        // Si el error es por falta de columnas, enviamos 400 (Bad Request)
        const statusCode = error.message.includes("Faltan las columnas") ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

router.post("/portatiles", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarPortatiles));
router.post("/usuarios", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarUsuarios));
router.post("/ambientes", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarAmbientes));
router.post("/reportes", verificarToken, verificarRol([ROLES.ADMIN, ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarReportes));

module.exports = router;
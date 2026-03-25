const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const { ROLES } = require("../constants/dominio");
const { importarPortatiles, importarUsuarios, importarAmbientes } = require("../services/importacion.service");

const manejarImportacion = (func) => async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No se envió archivo" });
        const resultado = await func(req.file.path);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post("/portatiles", verificarToken, verificarRol([ROLES.ADMIN,ROLES.INSTRUCTOR] ), upload.single("archivo"), manejarImportacion(importarPortatiles));
router.post("/usuarios", verificarToken, verificarRol([ROLES.ADMIN,ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarUsuarios));
router.post("/ambientes", verificarToken, verificarRol([ROLES.ADMIN,ROLES.INSTRUCTOR]), upload.single("archivo"), manejarImportacion(importarAmbientes));

module.exports = router;
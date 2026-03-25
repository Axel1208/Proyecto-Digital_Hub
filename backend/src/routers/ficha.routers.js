const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");
const validarCamposObligatorios = require("../middlewares/validarCamposObligatorios");
const {
  validarFichaActiva,
  validarCupoMaximo,
  validarAprendizNoRepetido
} = require("../middlewares/fichaValidations");
const fichaController = require("../controllers/ficha.controller");
const { ROLES } = require("../constants/dominio");

// Listar fichas y obtener ficha por id (público autenticado)
router.get("/", verificarToken, fichaController.obtenerFichas);
router.get("/:id", verificarToken, fichaController.obtenerFichaPorId);

// Instructor: crear, modificar, eliminar fichas
router.post(
  "/",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "programa_formacion", "jornada", "cupo_maximo"]),
  fichaController.crearFicha
);

router.put(
  "/:id",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarCamposObligatorios(["nombre", "programa_formacion", "jornada", "cupo_maximo", "estado"]),
  fichaController.modificarFicha
);

router.delete(
  "/:id",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  fichaController.eliminarFicha
);

// Aprendiz: unirse a ficha con validaciones de cupo, estado y duplicado
router.post(
  "/:id/unirse",
  verificarToken,
  verificarRol(ROLES.APRENDIZ),
  validarFichaActiva,
  validarCupoMaximo,
  validarAprendizNoRepetido,
  fichaController.unirseFicha
);

// Instructor: asignar aprendiz por correo a ficha
router.post(
  "/:id/asignar",
  verificarToken,
  verificarRol(ROLES.INSTRUCTOR),
  validarFichaActiva,
  validarCupoMaximo,
  fichaController.asignarAprendiz
);

module.exports = router;
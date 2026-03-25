const fichaService = require("../services/ficha.service");

/**
 * Middleware: Valida estado de ficha y cupo antes de ejecutar join.
 */
async function validarFichaActiva(req, res, next) {
  const { id } = req.params;
  const ficha = await fichaService.getFichaById(id);

  if (!ficha) {
    return res.status(404).json({ mensaje: "Ficha no encontrada" });
  }

  if (ficha.estado !== "activa") {
    return res.status(400).json({ mensaje: "La ficha debe estar activa" });
  }

  req.ficha = ficha; // para reuse
  next();
}

async function validarCupoMaximo(req, res, next) {
  const ficha = req.ficha;
  if (!ficha) {
    return res.status(500).json({ mensaje: "Error interno: ficha no cargada" });
  }

  const total = await fichaService.countAprendices(ficha.id_ficha);
  if (total >= ficha.cupo_maximo) {
    return res.status(400).json({ mensaje: "Cupo máximo alcanzado" });
  }

  next();
}

async function validarAprendizNoRepetido(req, res, next) {
  const id_ficha = req.ficha.id_ficha;
  const id_aprendiz = req.usuario.id;

  const repetido = await fichaService.hasAprendizJoined(id_ficha, id_aprendiz);
  if (repetido) {
    return res.status(409).json({ mensaje: "Aprendiz ya se encuentra en la ficha" });
  }

  const yaEnOtraFicha = await fichaService.aprendizYaEnAlgunaFicha(id_aprendiz);
  if (yaEnOtraFicha) {
    return res.status(409).json({ mensaje: "El aprendiz ya pertenece a una ficha" });
  }

  next();
}

module.exports = {
  validarFichaActiva,
  validarCupoMaximo,
  validarAprendizNoRepetido
};

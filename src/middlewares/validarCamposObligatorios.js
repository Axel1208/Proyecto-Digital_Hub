const validarCamposObligatorios = (campos = []) => {
  return (req, res, next) => {

    const camposFaltantes = campos.filter(campo =>
      req.body[campo] === undefined ||
      req.body[campo] === null ||
      req.body[campo] === ""
    );

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        mensaje: "Existen campos obligatorios faltantes",
        camposFaltantes
      });
    }

    next();
  };
};

module.exports = validarCamposObligatorios;

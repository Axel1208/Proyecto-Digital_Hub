const pool = require("../db/database");

const validarSerialNoRepetido = async (req, res, next) => {
  const { num_serie } = req.body;

  if (!num_serie) {
    return res.status(400).json({
      error: "El número de serie es obligatorio"
    });
  }

  try {
    const [resultado] = await pool.query(
      "SELECT id_portatil FROM portatiles WHERE num_serie = ?",
      [num_serie]
    );

    if (resultado.length > 0) {
      return res.status(409).json({
        error: "Este portátil ya está asignado. El serial no se puede repetir."
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al validar el número de serie"
    });
  }
};

module.exports = { validarSerialNoRepetido };
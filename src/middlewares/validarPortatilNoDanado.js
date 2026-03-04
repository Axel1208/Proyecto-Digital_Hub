const pool = require("../db/database");

const validarPortatilNoDanado = async (req, res, next) => {
  try {
    const { id_portatil } = req.body;

    const [rows] = await pool.query(
      "SELECT estado FROM portatil WHERE id_portatil = ?",
      [id_portatil]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Portátil no encontrado"
      });
    }

    if (rows[0].estado.toLowerCase() === "dañado") {
      return res.status(400).json({
        message: "No se puede asignar un portátil dañado"
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Error validando estado del portátil",
      error: error.message
    });
  }
};

module.exports = validarPortatilNoDanado;
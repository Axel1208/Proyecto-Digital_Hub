const pool = require("../db/database");

const actualizarEstadoPortatil = async (req, res, next) => {
  try {
    const { id_portatil } = req.body;
    const { tipo_operacion } = req.body; 
    // tipo_operacion puede ser: "asignar" o "devolver"

    let nuevoEstado = "";

    if (tipo_operacion === "asignar") {
      nuevoEstado = "asignado";
    }

    if (tipo_operacion === "devolver") {
      nuevoEstado = "disponible";
    }

    if (!nuevoEstado) {
      return res.status(400).json({
        message: "Tipo de operación inválido"
      });
    }

    await pool.query(
      "UPDATE portatil SET estado = ? WHERE id_portatil = ?",
      [nuevoEstado, id_portatil]
    );

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando estado del portátil",
      error: error.message
    });
  }
};

module.exports = actualizarEstadoPortatil;
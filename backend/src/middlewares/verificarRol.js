module.exports = function (...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No autenticado"
      });
    }

    // 🔐 Validar rol
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      console.log(`[verificarRol] rol recibido: "${req.usuario.rol}" | roles permitidos: ${JSON.stringify(rolesPermitidos)}`);
      return res.status(403).json({
        mensaje: "Acceso denegado"
      });
    }

    next();
  };
};
module.exports = function (...rolesPermitidos) {
  return (req, res, next) => {

    // 🔐 Validar autenticación previa
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No autenticado"
      });
    }

    // 🔐 Validar rol
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "Acceso denegado"
      });
    }

    next();
  };
};
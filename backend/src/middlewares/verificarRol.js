const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No autenticado"
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "Acceso denegado"
      });
    }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al verificar rol" });
    }
  };
};

module.exports = verificarRol;
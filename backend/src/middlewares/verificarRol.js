const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      // 🔴 Validar que exista usuario
      if (!req.usuario) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      // 🔴 Obtener rol y normalizarlo
      const rolUsuario = req.usuario.rol?.toString().trim().toLowerCase();

      // 🔴 Normalizar roles permitidos
      const rolesNormalizados = rolesPermitidos.map(r =>
        r.toString().trim().toLowerCase()
      );

      // 🔍 Debug (puedes quitarlo luego)
      console.log("ROL USUARIO:", rolUsuario);
      console.log("ROLES PERMITIDOS:", rolesNormalizados);

      // 🔴 Validación
      if (!rolesNormalizados.includes(rolUsuario)) {
        return res.status(403).json({
          error: "No tienes permisos",
          detalle: {
            rolUsuario,
            rolesPermitidos: rolesNormalizados
          }
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
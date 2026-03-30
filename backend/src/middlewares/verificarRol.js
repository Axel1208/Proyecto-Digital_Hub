// src/middlewares/verificarRol.js
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      // 1. Asegurarnos de que rolesPermitidos sea SIEMPRE un array
      const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

      // 2. Validar que exista el usuario (inyectado por verificarToken)
      if (!req.usuario || !req.usuario.rol) {
        return res.status(401).json({ error: "Usuario no autenticado o rol no definido" });
      }

      // 3. Normalizar el rol del usuario (quitar espacios y a minúsculas)
      const rolUsuario = req.usuario.rol.toString().trim().toLowerCase();

      // 4. Normalizar la lista de roles permitidos
      const rolesNormalizados = roles.map(r => 
        r.toString().trim().toLowerCase()
      );

      // 5. DEBUG (Opcional, para ver qué pasa en la consola)
      console.log(`[Auth] Usuario: ${rolUsuario} | Permitidos: ${rolesNormalizados}`);

      // 6. Validación final
      if (!rolesNormalizados.includes(rolUsuario)) {
        return res.status(403).json({
          error: "Acceso denegado",
          detalle: {
            tuRol: rolUsuario,
            rolesRequeridos: rolesNormalizados
          }
        });
      }

      next();
    } catch (error) {
      console.error("ERROR EN VERIFICAR_ROL:", error);
      res.status(500).json({ error: "Error interno al verificar permisos" });
    }
  };
};

module.exports = verificarRol;
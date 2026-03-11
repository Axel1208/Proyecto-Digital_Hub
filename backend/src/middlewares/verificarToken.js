const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // 🟢 NUEVO: Capturamos el header completo
    const authHeader = req.header("Authorization");

    // 🟢 NUEVO: Verificamos que exista y que empiece con "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Acceso denegado. Formato de token inválido (Use 'Bearer <token>')" });
    }

    // 🟢 NUEVO: Extraemos solo la parte del token (separando por el espacio)
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        // 🟢 NUEVO: Log para saber por qué falló el token (expirado, malformado, etc.)
        console.error("❌ Error verificando token:", error.message);
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};
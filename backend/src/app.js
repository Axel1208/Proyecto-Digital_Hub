// app.js - Puerto 5000
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// =========================================
// MIDDLEWARES
// =========================================

// CORS - Permite comunicación frontend (React) ↔ backend
app.use(cors({
    origin: "http://localhost:5173",   // Puerto de React con Vite
    // O si usas Create React App: "http://localhost:3000"
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================
// RUTAS - SEGURIDAD
// =========================================

// Rutas con seguridad (las originales)
// app.use("/api/usuarios", require("./routers/usuario.routers"));
// app.use("/api/portatiles", require("./routers/portatil.routers"));
// app.use("/api/reportes", require("./routers/reportes.routers"));
// app.use("/api/ambiente", require("./routers/ambiente.routers"));
// app.use("/api/ficha", require("./routers/ficha.routers"));

// =========================================
// RUTAS - SIN SEGURIDAD (PARA PROBAR FRONTEND)
// =========================================

//        ↓ prefijo URL                    ↓ archivo de rutas
app.use("/api/usuarioprueba", require("./routers/usuarioPrueba.routers"));

// =========================================
// RUTA DE PRUEBA
// =========================================
app.get("/api/test", (req, res) => {
    res.json({ mensaje: "✅ Servidor funcionando" });
});

// =========================================
// MANEJO DE ERRORES 404
// =========================================
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// =========================================
// INICIAR SERVIDOR - PUERTO 5000
// =========================================
const PORT = process.env.PORT || 5000;  // ← Cambiado a 5000

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
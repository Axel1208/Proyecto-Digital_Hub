const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===============================
// MIDDLEWARES GLOBALES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROUTERS
// ===============================
const usuarioRouter = require("./routers/usuario.routers");
const portatilRouter = require("./routers/portatil.routers");
const reportesRouter = require("./routers/reportes.routers");
const ambienteRouter = require("./routers/ambiente.routers");
const fichaRouter = require("./routers/ficha.routers");

// ===============================
// RUTAS PRINCIPALES (API)
// ===============================
app.use("/api/usuarios", usuarioRouter);
app.use("/api/portatiles", portatilRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api/ambientes", ambienteRouter);
app.use("/api/fichas", fichaRouter);

// ===============================
// ARCHIVOS ESTÁTICOS
// ===============================
app.use("/uploads", express.static("uploads"));
app.use("/api", usuarioRouter);
app.use("/api/reportes", reportesRouter);
app.use("/portatil", require("./routers/portatil.routers"));
app.use("/reportes", require("./routers/reportes.routers"));
app.use("/ambiente", require("./routers/ambiente.routers"));
app.use("/ficha", require("./routers/ficha.routers"));
app.use("/asignacion", require("./routers/asignacion.routers"));

// ===============================
// RUTA DE PRUEBA
// ===============================
app.get("/", (req, res) => {
    res.send("API DigitalHub funcionando 🚀");
});

// ===============================
// MANEJO DE ERRORES BÁSICO
// ===============================
app.use((req, res) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada"
    });
});

// ===============================
// SERVIDOR
// ===============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

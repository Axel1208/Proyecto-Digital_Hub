// app.js
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// ============================
// MIDDLEWARES
// ============================

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// ROUTERS
// ============================

const usuarioRouter = require("./routers/usuario.routers");
const portatilRouter = require("./routers/portatil.routers");
const reportesRouter = require("./routers/reportes.routers");

// 👇 RUTAS BIEN DEFINIDAS
app.use("/api/usuarios", usuarioRouter);
app.use("/api/portatiles", portatilRouter); // 👈 mejor en plural
app.use("/api/reportes", reportesRouter);

// Otros módulos
app.use("/api/ambientes", require("./routers/ambiente.routers"));
app.use("/api/fichas", require("./routers/ficha.routers"));

// Archivos estáticos
app.use("/uploads", express.static("uploads"));

// ============================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
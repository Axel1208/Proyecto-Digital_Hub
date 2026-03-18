// app.js - Puerto 3001
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// CORS para permitir peticiones desde el frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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

// routers
const usuarioRouter = require("./routers/usuario.routers");
const reportesRouter = require("./routers/reportes.routers");

app.use("/api", usuarioRouter);
app.use("/api/reportes", reportesRouter);
app.use("/portatil", require("./routers/portatil.routers"));
app.use("/reportes", require("./routers/reportes.routers"));
app.use("/ambiente", require("./routers/ambiente.routers"));
app.use("/ficha", require("./routers/ficha.routers"));
app.use("/asignacion", require("./routers/asignacion.routers"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
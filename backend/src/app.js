const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/usuarios", require("./routers/usuario.routers"));
app.use("/api/portatiles", require("./routers/portatil.routers"));
app.use("/api/reportes", require("./routers/reportes.routers"));
app.use("/api/ambientes", require("./routers/ambiente.routers"));
app.use("/api/fichas", require("./routers/ficha.routers"));
app.use("/api/asignaciones", require("./routers/asignacion.routers"));

app.get("/", (req, res) => res.send("API DigitalHub funcionando 🚀"));

app.use((req, res) => res.status(404).json({ mensaje: "Ruta no encontrada" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));

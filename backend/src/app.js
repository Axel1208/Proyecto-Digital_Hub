require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const usuarioRouter = require("./routers/usuario.routers");

app.use("/api", usuarioRouter);

app.use("/portatil", require("./routers/portatil.routers"));
app.use("/reportes", require("./routers/reportes.routers"));
app.use("/ambiente", require("./routers/ambiente.routers"));
app.use("/ficha", require("./routers/ficha.routers"));
app.use("/asignacion", require("./routers/asignacion.routers"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
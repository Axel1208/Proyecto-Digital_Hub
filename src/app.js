const express = require("express");
const app = express();
const usuarioRouter = require("./routers/usuario.routers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use("/portatil", require("./routers/portatil.routers"));
app.use("/reportes", require("./routers/reportes.routers"));
app.use("/ambiente", require("./routers/ambiente.routers"));
app.use("/ficha", require("./routers/ficha.routers"));
app.use("/api", usuarioRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
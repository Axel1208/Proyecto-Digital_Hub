const express = require("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use("/portatil", require("./routers/portatil.routers"));
app.use("/ficha", require("./routers/ficha.routers"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* 1️⃣ Servir el frontend */
app.use(express.static(path.join(__dirname, "frontend")));

/* 2️⃣ Middleware de seguridad para la API */
app.use((req, res, next) => {

  if (
    req.path.startsWith("/productos") ||
    req.path.startsWith("/usuarios") ||
    req.path.startsWith("/ventas") ||
    req.path.startsWith("/pedidos")
  ) {

    const apiKey = req.headers["password"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key requerida"
      });
    }

    if (apiKey !== process.env.API_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: "Password incorrecta"
      });
    }
  }

  next();
});

/* 3️⃣ Rutas de la API */
app.use("/productos", require("./routes/productosRutas"));
app.use("/usuarios", require("./routes/usuariosRutas"));
app.use("/pedidos", require("./routes/pedidosRutas"));
app.use("/ventas", require("./routes/ventasRutas"));

/* 4️⃣ Arrancar servidor */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
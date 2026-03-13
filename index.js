// ============================================================
// index.js - Archivo principal del servidor
// Este archivo es el punto de entrada de toda la aplicación.
// Aquí se configura Express, se registran las rutas de cada
// módulo y se levanta el servidor en el puerto 3000.
// ============================================================

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importamos las rutas de cada módulo
const usuariosRoutes = require('./Usuarios/UsuariosRutas');
const productosRoutes = require('./Productos/ProductosRutas');
const pedidosRoutes = require('./Pedidos/PedidosRutas');
const ventasRoutes = require('./Ventas/VentasRutas');

// Permite que el frontend pueda conectarse al backend
app.use(cors());

// Middleware para parsear JSON en las peticiones POST y PUT
app.use(express.json());

// Registro de rutas con su prefijo de URL
app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/ventas', ventasRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log("Server esta arriba " + port);
});
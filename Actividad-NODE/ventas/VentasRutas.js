// ============================================================
// VentasRutas.js - Módulo de gestión de ventas
// Contiene todos los endpoints CRUD para manejar el historial
// de ventas del sistema. Todas las rutas requieren contraseña.
// ============================================================

const express = require("express");
const router = express.Router();

// ------------------------------------------------------------
// Ventas almacenadas en memoria
// Campos: id, fecha, usuario, total, metodoPago, estado
// Estados posibles: completada, pendiente, cancelada
// ------------------------------------------------------------
const ventas = [
  { id: 1, fecha: "2025-01-10", usuario: "carla",       total: 70000,  metodoPago: "efectivo",     estado: "completada" },
  { id: 2, fecha: "2025-01-15", usuario: "davier",      total: 120000, metodoPago: "tarjeta",       estado: "completada" },
  { id: 3, fecha: "2025-02-01", usuario: "manuela",     total: 225000, metodoPago: "transferencia", estado: "pendiente"  },
  { id: 4, fecha: "2025-02-10", usuario: "miguel sama", total: 120000, metodoPago: "efectivo",      estado: "cancelada"  },
];

const CONTRASENA = "sena2025";

// ------------------------------------------------------------
// Middleware: verificarContrasena
// Valida la contraseña del header antes de cada endpoint.
// Responde 401 si no se envía o si es incorrecta.
// ------------------------------------------------------------
const verificarContrasena = (req, res, next) => {
  const password = req.headers['password'];
  if (!password || password !== CONTRASENA) {
    return res.status(401).json({ error: "Incorrect password, or password not sent" });
  }
  next();
};

// ------------------------------------------------------------
// GET /ventas
// Retorna todas las ventas con soporte para filtros.
// Ejemplo: GET /ventas?estado=completada
// Ejemplo: GET /ventas?metodoPago=efectivo&usuario=carla
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  const { id, fecha, usuario, total, metodoPago, estado } = req.query;

  let filteredVentas = ventas.filter(v => {
    return (
      (!id         || v.id == id) &&
      (!fecha      || v.fecha == fecha) &&
      (!usuario    || v.usuario.toLowerCase().includes(usuario.toLowerCase())) &&
      (!total      || v.total == total) &&
      (!metodoPago || v.metodoPago.toLowerCase().includes(metodoPago.toLowerCase())) &&
      (!estado     || v.estado.toLowerCase().includes(estado.toLowerCase()))
    );
  });

  res.json(filteredVentas);
});

// ------------------------------------------------------------
// GET /ventas/:id
// Retorna una venta específica buscada por su ID.
// Ejemplo: GET /ventas/2
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  const venta = ventas.find((v) => v.id == req.params.id);
  if (!venta) return res.status(404).json({ error: "venta no encontrada" });
  res.send(JSON.stringify(venta, null, 2));
});

// ------------------------------------------------------------
// POST /ventas
// Registra una nueva venta con los datos del body.
// El ID se asigna automáticamente.
// Ejemplo de body: { "fecha": "2025-03-01", "usuario": "laura", "total": 60000, "metodoPago": "tarjeta", "estado": "completada" }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  // Separamos el campo password para no guardarlo en la venta
  const { password, ...nuevaVenta } = req.body;
  nuevaVenta.id = ventas.length + 1;
  ventas.push(nuevaVenta);
  res.status(201).send(JSON.stringify(nuevaVenta, null, 2));
});

// ------------------------------------------------------------
// PUT /ventas/:id
// Actualiza una venta existente por su ID.
// Útil por ejemplo para cambiar el estado de pendiente a completada.
// Ejemplo: PUT /ventas/3 con body { "estado": "completada" }
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const index = ventas.findIndex((v) => v.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "venta no encontrada" });
  // Conservamos los campos actuales y sobreescribimos los del body
  ventas[index] = { ...ventas[index], ...req.body };
  res.send(JSON.stringify(ventas[index], null, 2));
});

// ------------------------------------------------------------
// DELETE /ventas/:id
// Elimina una venta del historial por su ID.
// Responde con los datos de la venta eliminada.
// Ejemplo: DELETE /ventas/4
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  const index = ventas.findIndex((v) => v.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "venta no encontrada" });
  const eliminado = ventas.splice(index, 1);
  res.json({ mensaje: "venta eliminada", venta: eliminado[0] });
});

module.exports = router;
// ============================================================
// PedidosRutas.js - Módulo de gestión de pedidos
// Contiene todos los endpoints CRUD para manejar los pedidos
// realizados por los usuarios. Todas las rutas requieren contraseña.
// ============================================================

const express = require("express");
const router = express.Router();

// ------------------------------------------------------------
// Pedidos almacenados en memoria
// Campos: id, usuario, producto, cantidad, total
// ------------------------------------------------------------
const pedidos = [
  { id: 1, usuario: "carla",       producto: "camisa",   cantidad: 2, total: 70000  },
  { id: 2, usuario: "davier",      producto: "tenis",    cantidad: 1, total: 120000 },
  { id: 3, usuario: "manuela",     producto: "mochila",  cantidad: 3, total: 225000 },
  { id: 4, usuario: "miguel sama", producto: "pantalon", cantidad: 2, total: 120000 },
];

const CONTRASENA = "sena2025";

// ------------------------------------------------------------
// Middleware: verificarContrasena
// Intercepta la petición antes del endpoint y valida
// que el header 'password' tenga el valor correcto.
// ------------------------------------------------------------
const verificarContrasena = (req, res, next) => {
  const password = req.headers['password'];
  if (!password || password !== CONTRASENA) {
    return res.status(401).json({ error: "Incorrect password, or password not sent" });
  }
  next();
};

// ------------------------------------------------------------
// GET /pedidos
// Retorna todos los pedidos con soporte para filtros.
// Ejemplo: GET /pedidos?usuario=carla
// Ejemplo: GET /pedidos?producto=tenis&cantidad=1
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  const { id, usuario, producto, cantidad, total } = req.query;

  let filteredPedidos = pedidos.filter(p => {
    return (
      (!id       || p.id == id) &&
      (!usuario  || p.usuario.toLowerCase().includes(usuario.toLowerCase())) &&
      (!producto || p.producto.toLowerCase().includes(producto.toLowerCase())) &&
      (!cantidad || p.cantidad == cantidad) &&
      (!total    || p.total == total)
    );
  });

  res.json(filteredPedidos);
});

// ------------------------------------------------------------
// GET /pedidos/:id
// Busca y retorna un pedido específico por su ID.
// Ejemplo: GET /pedidos/2
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  const pedido = pedidos.find((p) => p.id == req.params.id);
  if (!pedido) return res.status(404).json({ error: "pedido no encontrado" });
  res.send(JSON.stringify(pedido, null, 2));
});

// ------------------------------------------------------------
// POST /pedidos
// Registra un nuevo pedido con los datos del body.
// El ID se asigna automáticamente.
// Ejemplo de body: { "usuario": "laura", "producto": "camisa", "cantidad": 1, "total": 35000 }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  // Excluimos el campo password antes de guardar el pedido
  const { password, ...nuevoPedido } = req.body;
  nuevoPedido.id = pedidos.length + 1;
  pedidos.push(nuevoPedido);
  res.status(201).send(JSON.stringify(nuevoPedido, null, 2));
});

// ------------------------------------------------------------
// PUT /pedidos/:id
// Actualiza un pedido existente por su ID.
// Solo se modifican los campos que lleguen en el body.
// Ejemplo: PUT /pedidos/1 con body { "cantidad": 5, "total": 175000 }
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const index = pedidos.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "pedido no encontrado" });
  // El spread operator conserva los campos actuales y sobreescribe los nuevos
  pedidos[index] = { ...pedidos[index], ...req.body };
  res.send(JSON.stringify(pedidos[index], null, 2));
});

// ------------------------------------------------------------
// DELETE /pedidos/:id
// Elimina un pedido por su ID.
// Responde con el pedido eliminado como confirmación.
// Ejemplo: DELETE /pedidos/3
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  const index = pedidos.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "pedido no encontrado" });
  const eliminado = pedidos.splice(index, 1);
  res.json({ mensaje: "pedido eliminado", pedido: eliminado[0] });
});

module.exports = router;
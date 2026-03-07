// ============================================================
// PedidosRutas.js - Módulo de gestión de pedidos
// Ahora conectado a SQLite en vez de arreglos en memoria.
// Valida que el usuarioId y productoId existan antes de insertar.
// ============================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

const CONTRASENA = "sena2025";

// ------------------------------------------------------------
// Middleware: verificarContrasena
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
// Retorna todos los pedidos.
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  db.all('SELECT * FROM pedidos', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
});

// ------------------------------------------------------------
// GET /pedidos/:id
// Busca un pedido por ID. Retorna 404 si no existe.
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM pedidos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });
    res.json(row);
  });
});

// ------------------------------------------------------------
// POST /pedidos
// Crea un nuevo pedido.
// Validaciones: campos obligatorios, tipos, y que el usuario
// y producto referenciados existan en la BD.
// Ejemplo body: { "usuarioId": 1, "productoId": 2, "cantidad": 3, "total": 90000 }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  const { usuarioId, productoId, cantidad, total } = req.body;

  // Validación: campos obligatorios
  if (!usuarioId || !productoId || !cantidad || !total) {
    return res.status(400).json({
      success: false,
      message: 'usuarioId, productoId, cantidad y total son obligatorios'
    });
  }

  // Validación: cantidad debe ser entero mayor a 0
  if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'cantidad debe ser un número entero mayor a 0'
    });
  }

  // Validación: total debe ser número mayor a 0
  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'total debe ser un número mayor a 0'
    });
  }

  // Verificamos que el usuario exista
  db.get('SELECT id FROM usuarios WHERE id = ?', [usuarioId], (err, usuario) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!usuario) return res.status(404).json({ success: false, message: 'el usuarioId no existe' });

    // Verificamos que el producto exista
    db.get('SELECT id FROM productos WHERE id = ?', [productoId], (err, producto) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!producto) return res.status(404).json({ success: false, message: 'el productoId no existe' });

      // Todo bien, insertamos el pedido
      db.run(
        'INSERT INTO pedidos (usuarioId, productoId, cantidad, total) VALUES (?, ?, ?, ?)',
        [usuarioId, productoId, Number(cantidad), Number(total)],
        function(err) {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.status(201).json({
            success: true,
            data: { id: this.lastID, usuarioId, productoId, cantidad: Number(cantidad), total: Number(total) }
          });
        }
      );
    });
  });
});

// ------------------------------------------------------------
// PUT /pedidos/:id
// Actualiza un pedido existente.
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const { usuarioId, productoId, cantidad, total } = req.body;

  // Validación: campos obligatorios
  if (!usuarioId || !productoId || !cantidad || !total) {
    return res.status(400).json({
      success: false,
      message: 'usuarioId, productoId, cantidad y total son obligatorios'
    });
  }

  // Validación: tipos
  if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
    return res.status(400).json({ success: false, message: 'cantidad debe ser un entero mayor a 0' });
  }

  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  // Verificamos que el pedido exista
  db.get('SELECT * FROM pedidos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });

    db.run(
      'UPDATE pedidos SET usuarioId = ?, productoId = ?, cantidad = ?, total = ? WHERE id = ?',
      [usuarioId, productoId, Number(cantidad), Number(total), req.params.id],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: { id: Number(req.params.id), usuarioId, productoId, cantidad: Number(cantidad), total: Number(total) } });
      }
    );
  });
});

// ------------------------------------------------------------
// DELETE /pedidos/:id
// Elimina un pedido. Retorna 404 si no existe.
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM pedidos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });

    db.run('DELETE FROM pedidos WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'pedido eliminado', pedido: row });
    });
  });
});

module.exports = router;
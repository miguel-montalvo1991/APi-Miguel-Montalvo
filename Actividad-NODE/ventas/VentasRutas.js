// ============================================================
// VentasRutas.js - Módulo de gestión de ventas
// Ahora conectado a SQLite en vez de arreglos en memoria.
// Valida metodoPago, estado y que el usuario exista.
// ============================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

const CONTRASENA = "sena2025";

// Valores permitidos para metodoPago y estado
const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia'];
const ESTADOS      = ['completada', 'pendiente', 'cancelada'];

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
// GET /ventas
// Retorna todas las ventas.
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  db.all('SELECT * FROM ventas', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
});

// ------------------------------------------------------------
// GET /ventas/:id
// Busca una venta por ID. Retorna 404 si no existe.
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM ventas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });
    res.json(row);
  });
});

// ------------------------------------------------------------
// POST /ventas
// Crea una nueva venta.
// Validaciones: campos obligatorios, total > 0,
// metodoPago y estado deben ser valores válidos,
// y el usuarioId debe existir en la BD.
// Ejemplo body: { "usuarioId": 1, "fecha": "2025-03-01", "total": 60000, "metodoPago": "tarjeta", "estado": "completada" }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  // Validación: campos obligatorios
  if (!usuarioId || !fecha || !total || !metodoPago) {
    return res.status(400).json({
      success: false,
      message: 'usuarioId, fecha, total y metodoPago son obligatorios'
    });
  }

  // Validación: total debe ser número mayor a 0
  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'total debe ser un número mayor a 0'
    });
  }

  // Validación: metodoPago debe ser uno de los permitidos
  if (!METODOS_PAGO.includes(metodoPago)) {
    return res.status(400).json({
      success: false,
      message: `metodoPago debe ser: ${METODOS_PAGO.join(', ')}`
    });
  }

  // Validación: estado debe ser uno de los permitidos (si se envía)
  const estadoFinal = estado || 'pendiente';
  if (!ESTADOS.includes(estadoFinal)) {
    return res.status(400).json({
      success: false,
      message: `estado debe ser: ${ESTADOS.join(', ')}`
    });
  }

  // Verificamos que el usuario exista
  db.get('SELECT id FROM usuarios WHERE id = ?', [usuarioId], (err, usuario) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!usuario) return res.status(404).json({ success: false, message: 'el usuarioId no existe' });

    db.run(
      'INSERT INTO ventas (usuarioId, fecha, total, metodoPago, estado) VALUES (?, ?, ?, ?, ?)',
      [usuarioId, fecha, Number(total), metodoPago, estadoFinal],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({
          success: true,
          data: { id: this.lastID, usuarioId, fecha, total: Number(total), metodoPago, estado: estadoFinal }
        });
      }
    );
  });
});

// ------------------------------------------------------------
// PUT /ventas/:id
// Actualiza una venta existente.
// Muy útil para cambiar el estado de pendiente a completada.
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  // Validación: campos obligatorios
  if (!usuarioId || !fecha || !total || !metodoPago || !estado) {
    return res.status(400).json({
      success: false,
      message: 'usuarioId, fecha, total, metodoPago y estado son obligatorios'
    });
  }

  // Validación: total
  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  // Validación: metodoPago
  if (!METODOS_PAGO.includes(metodoPago)) {
    return res.status(400).json({ success: false, message: `metodoPago debe ser: ${METODOS_PAGO.join(', ')}` });
  }

  // Validación: estado
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ success: false, message: `estado debe ser: ${ESTADOS.join(', ')}` });
  }

  // Verificamos que la venta exista
  db.get('SELECT * FROM ventas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });

    db.run(
      'UPDATE ventas SET usuarioId = ?, fecha = ?, total = ?, metodoPago = ?, estado = ? WHERE id = ?',
      [usuarioId, fecha, Number(total), metodoPago, estado, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: { id: Number(req.params.id), usuarioId, fecha, total: Number(total), metodoPago, estado } });
      }
    );
  });
});

// ------------------------------------------------------------
// DELETE /ventas/:id
// Elimina una venta. Retorna 404 si no existe.
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM ventas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });

    db.run('DELETE FROM ventas WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'venta eliminada', venta: row });
    });
  });
});

module.exports = router;
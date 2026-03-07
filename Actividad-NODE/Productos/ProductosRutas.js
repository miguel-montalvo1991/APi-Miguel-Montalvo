// ============================================================
// ProductosRutas.js - Módulo de gestión de productos
// Ahora conectado a SQLite en vez de arreglos en memoria.
// Incluye validaciones de tipos numéricos y campos obligatorios.
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
// GET /productos
// Retorna todos los productos.
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
});

// ------------------------------------------------------------
// GET /productos/:id
// Busca un producto por ID. Retorna 404 si no existe.
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });
    res.json(row);
  });
});

// ------------------------------------------------------------
// POST /productos
// Crea un nuevo producto.
// Validaciones: campos obligatorios, precio > 0, stock >= 0
// Ejemplo body: { "nombre": "gorra", "categoria": "accesorios", "precio": 25000, "stock": 15 }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'nombre, categoria, precio y stock son obligatorios'
    });
  }

  // Validación: precio debe ser número mayor a 0
  if (isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'precio debe ser un número mayor a 0'
    });
  }

  // Validación: stock debe ser entero mayor o igual a 0
  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({
      success: false,
      message: 'stock debe ser un número entero mayor o igual a 0'
    });
  }

  db.run(
    'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, categoria, Number(precio), Number(stock)],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({
        success: true,
        data: { id: this.lastID, nombre, categoria, precio: Number(precio), stock: Number(stock) }
      });
    }
  );
});

// ------------------------------------------------------------
// PUT /productos/:id
// Actualiza un producto existente.
// Validaciones: que exista, campos obligatorios, tipos correctos.
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'nombre, categoria, precio y stock son obligatorios'
    });
  }

  // Validación: precio
  if (isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'precio debe ser un número mayor a 0'
    });
  }

  // Validación: stock
  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({
      success: false,
      message: 'stock debe ser un número entero mayor o igual a 0'
    });
  }

  // Verificamos que el producto exista
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });

    db.run(
      'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, categoria, Number(precio), Number(stock), req.params.id],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: { id: Number(req.params.id), nombre, categoria, precio: Number(precio), stock: Number(stock) } });
      }
    );
  });
});

// ------------------------------------------------------------
// DELETE /productos/:id
// Elimina un producto. Retorna 404 si no existe.
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });

    db.run('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'producto eliminado', producto: row });
    });
  });
});

module.exports = router;
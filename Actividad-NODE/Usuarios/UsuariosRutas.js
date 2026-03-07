// ============================================================
// UsuariosRutas.js - Módulo de gestión de usuarios
// Ahora conectado a SQLite en vez de arreglos en memoria.
// Incluye validaciones de campos obligatorios y unicidad.
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
// GET /usuarios
// Retorna todos los usuarios. Se pueden filtrar por query params.
// Ejemplo: GET /usuarios?nombre=carla
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
});

// ------------------------------------------------------------
// GET /usuarios/:id
// Busca un usuario por ID. Retorna 404 si no existe.
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });
    res.json(row);
  });
});

// ------------------------------------------------------------
// POST /usuarios
// Crea un nuevo usuario.
// Validaciones: nombre y email obligatorios, email único.
// Ejemplo body: { "nombre": "juan", "apellido": "perez", "email": "juan@mail.com", "telefono": "123456" }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      message: 'nombre y email son obligatorios'
    });
  }

  // Validación: email no debe estar ya registrado
  db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (row) {
      return res.status(400).json({
        success: false,
        message: 'ese email ya está registrado'
      });
    }

    // Todo bien, insertamos el usuario
    db.run(
      'INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
      [nombre, apellido || null, email, telefono || null],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({
          success: true,
          data: { id: this.lastID, nombre, apellido, email, telefono }
        });
      }
    );
  });
});

// ------------------------------------------------------------
// PUT /usuarios/:id
// Actualiza un usuario existente.
// Validaciones: que exista, nombre y email obligatorios, email único.
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      message: 'nombre y email son obligatorios'
    });
  }

  // Verificamos que el usuario exista
  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    // Verificamos que el email no lo tenga otro usuario diferente
    db.get('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, req.params.id], (err, otro) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (otro) {
        return res.status(400).json({
          success: false,
          message: 'ese email ya lo tiene otro usuario'
        });
      }

      // Actualizamos
      db.run(
        'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?',
        [nombre, apellido || null, email, telefono || null, req.params.id],
        function(err) {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, data: { id: Number(req.params.id), nombre, apellido, email, telefono } });
        }
      );
    });
  });
});

// ------------------------------------------------------------
// DELETE /usuarios/:id
// Elimina un usuario. Retorna 404 si no existe.
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    db.run('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'usuario eliminado', usuario: row });
    });
  });
});

module.exports = router;
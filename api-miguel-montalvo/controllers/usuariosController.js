// ============================================================
// controllers/usuariosController.js - Lógica de negocio: usuarios
// Aquí van las validaciones y el flujo de cada operación.
// El controlador usa el modelo para hablar con la base de datos.
// ============================================================

const usuariosModel = require('../models/usuariosModel');

const obtenerUsuarios = (req, res) => {
  usuariosModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
};

const obtenerUsuarioPorId = (req, res) => {
  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });
    res.json(row);
  });
};

const crearUsuario = (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ success: false, message: 'nombre y email son obligatorios' });
  }

  usuariosModel.obtenerPorEmail(email, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (row) return res.status(400).json({ success: false, message: 'ese email ya está registrado' });

    usuariosModel.insertar({ nombre, apellido, email, telefono }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({
        success: true,
        data: { id: this.lastID, nombre, apellido, email, telefono }
      });
    });
  });
};

const actualizarUsuario = (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ success: false, message: 'nombre y email son obligatorios' });
  }

  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    usuariosModel.obtenerPorEmailExcluyendo(email, req.params.id, (err, otro) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (otro) return res.status(400).json({ success: false, message: 'ese email ya lo tiene otro usuario' });

      usuariosModel.actualizar(req.params.id, { nombre, apellido, email, telefono }, function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: { id: Number(req.params.id), nombre, apellido, email, telefono } });
      });
    });
  });
};

const eliminarUsuario = (req, res) => {
  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    usuariosModel.eliminar(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'usuario eliminado', usuario: row });
    });
  });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
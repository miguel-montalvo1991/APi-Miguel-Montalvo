// ============================================================
// models/usuariosModel.js - Capa de acceso a datos: usuarios
// Aquí van solo las consultas SQL, sin lógica de negocio.
// El controlador llama a estas funciones y decide qué responder.
// ============================================================

const db = require('../db/db');

const obtenerTodos = (callback) => {
  db.all('SELECT * FROM usuarios', [], callback);
};

const obtenerPorId = (id, callback) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [id], callback);
};

const obtenerPorEmail = (email, callback) => {
  db.get('SELECT id FROM usuarios WHERE email = ?', [email], callback);
};

const obtenerPorEmailExcluyendo = (email, id, callback) => {
  db.get('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id], callback);
};

const insertar = (datos, callback) => {
  const { nombre, apellido, email, telefono } = datos;
  db.run(
    'INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
    [nombre, apellido || null, email, telefono || null],
    callback
  );
};

const actualizar = (id, datos, callback) => {
  const { nombre, apellido, email, telefono } = datos;
  db.run(
    'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?',
    [nombre, apellido || null, email, telefono || null, id],
    callback
  );
};

const eliminar = (id, callback) => {
  db.run('DELETE FROM usuarios WHERE id = ?', [id], callback);
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorEmail,
  obtenerPorEmailExcluyendo,
  insertar,
  actualizar,
  eliminar
};
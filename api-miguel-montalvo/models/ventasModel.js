// ============================================================
// models/ventasModel.js - Capa de acceso a datos: ventas
// Solo consultas SQL. Sin validaciones, eso le toca al controlador.
// ============================================================

const db = require('../db/db');

const obtenerTodas = (callback) => {
  db.all('SELECT * FROM ventas', [], callback);
};

const obtenerPorId = (id, callback) => {
  db.get('SELECT * FROM ventas WHERE id = ?', [id], callback);
};

const insertar = (datos, callback) => {
  const { usuarioId, fecha, total, metodoPago, estado } = datos;
  db.run(
    'INSERT INTO ventas (usuarioId, fecha, total, metodoPago, estado) VALUES (?, ?, ?, ?, ?)',
    [usuarioId, fecha, Number(total), metodoPago, estado],
    callback
  );
};

const actualizar = (id, datos, callback) => {
  const { usuarioId, fecha, total, metodoPago, estado } = datos;
  db.run(
    'UPDATE ventas SET usuarioId = ?, fecha = ?, total = ?, metodoPago = ?, estado = ? WHERE id = ?',
    [usuarioId, fecha, Number(total), metodoPago, estado, id],
    callback
  );
};

const eliminar = (id, callback) => {
  db.run('DELETE FROM ventas WHERE id = ?', [id], callback);
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  insertar,
  actualizar,
  eliminar
};
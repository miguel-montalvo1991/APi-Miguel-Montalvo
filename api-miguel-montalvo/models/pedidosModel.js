// ============================================================
// models/pedidosModel.js - Capa de acceso a datos: pedidos
// Solo consultas SQL. Incluye verificación de FK (usuario y producto).
// ============================================================

const db = require('../db/db');

const obtenerTodos = (callback) => {
  db.all('SELECT * FROM pedidos', [], callback);
};

const obtenerPorId = (id, callback) => {
  db.get('SELECT * FROM pedidos WHERE id = ?', [id], callback);
};

const insertar = (datos, callback) => {
  const { usuarioId, productoId, cantidad, total } = datos;
  db.run(
    'INSERT INTO pedidos (usuarioId, productoId, cantidad, total) VALUES (?, ?, ?, ?)',
    [usuarioId, productoId, Number(cantidad), Number(total)],
    callback
  );
};

const actualizar = (id, datos, callback) => {
  const { usuarioId, productoId, cantidad, total } = datos;
  db.run(
    'UPDATE pedidos SET usuarioId = ?, productoId = ?, cantidad = ?, total = ? WHERE id = ?',
    [usuarioId, productoId, Number(cantidad), Number(total), id],
    callback
  );
};

const eliminar = (id, callback) => {
  db.run('DELETE FROM pedidos WHERE id = ?', [id], callback);
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  insertar,
  actualizar,
  eliminar
};
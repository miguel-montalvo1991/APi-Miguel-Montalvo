// ============================================================
// models/productosModel.js - Capa de acceso a datos: productos
// Solo consultas SQL. El controlador decide qué hacer con el resultado.
// ============================================================

const db = require('../db/db');

const obtenerTodos = (callback) => {
  db.all('SELECT * FROM productos', [], callback);
};

const obtenerPorId = (id, callback) => {
  db.get('SELECT * FROM productos WHERE id = ?', [id], callback);
};

const insertar = (datos, callback) => {
  const { nombre, categoria, precio, stock } = datos;
  db.run(
    'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, categoria, Number(precio), Number(stock)],
    callback
  );
};

const actualizar = (id, datos, callback) => {
  const { nombre, categoria, precio, stock } = datos;
  db.run(
    'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, categoria, Number(precio), Number(stock), id],
    callback
  );
};

const eliminar = (id, callback) => {
  db.run('DELETE FROM productos WHERE id = ?', [id], callback);
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  insertar,
  actualizar,
  eliminar
};
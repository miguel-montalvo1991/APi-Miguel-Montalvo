// ============================================================
// models/productosModel.js - Capa de acceso a datos: productos
//
// Solo consultas SQL. El controlador decide qué hacer con el resultado.
// Seguimos el mismo patrón que usuariosModel.js
// ============================================================

const db = require('../db/db');

// Obtiene todos los productos
const obtenerTodos = (callback) => {
  db.all('SELECT * FROM productos', [], callback);
};

// Obtiene un producto por ID
const obtenerPorId = (id, callback) => {
  db.get('SELECT * FROM productos WHERE id = ?', [id], callback);
};

// Inserta un nuevo producto
// Number(precio) y Number(stock) convierten los valores a número
// por si llegan como strings desde el body de la petición
const insertar = (datos, callback) => {
  const { nombre, categoria, precio, stock } = datos;
  db.run(
    'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, categoria, Number(precio), Number(stock)],
    callback
  );
};

// Actualiza un producto existente
const actualizar = (id, datos, callback) => {
  const { nombre, categoria, precio, stock } = datos;
  db.run(
    'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, categoria, Number(precio), Number(stock), id],
    callback
  );
};

// Elimina un producto por ID
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
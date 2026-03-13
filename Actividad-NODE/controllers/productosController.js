// ============================================================
// controllers/productosController.js - Lógica de negocio: productos
// ============================================================

const productosModel = require('../models/productosModel');

const obtenerProductos = (req, res) => {
  productosModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
};

const obtenerProductoPorId = (req, res) => {
  productosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });
    res.json(row);
  });
};

const crearProducto = (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: 'nombre, categoria, precio y stock son obligatorios' });
  }

  if (isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({ success: false, message: 'precio debe ser un número mayor a 0' });
  }

  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ success: false, message: 'stock debe ser un número entero mayor o igual a 0' });
  }

  productosModel.insertar({ nombre, categoria, precio, stock }, function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(201).json({
      success: true,
      data: { id: this.lastID, nombre, categoria, precio: Number(precio), stock: Number(stock) }
    });
  });
};

const actualizarProducto = (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: 'nombre, categoria, precio y stock son obligatorios' });
  }

  if (isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({ success: false, message: 'precio debe ser un número mayor a 0' });
  }

  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ success: false, message: 'stock debe ser un número entero mayor o igual a 0' });
  }

  productosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });

    productosModel.actualizar(req.params.id, { nombre, categoria, precio, stock }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: { id: Number(req.params.id), nombre, categoria, precio: Number(precio), stock: Number(stock) } });
    });
  });
};

const eliminarProducto = (req, res) => {
  productosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'producto no encontrado' });

    productosModel.eliminar(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'producto eliminado', producto: row });
    });
  });
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
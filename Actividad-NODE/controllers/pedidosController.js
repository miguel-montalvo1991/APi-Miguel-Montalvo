// ============================================================
// controllers/pedidosController.js - Lógica de negocio: pedidos
// ============================================================

const pedidosModel = require('../models/pedidosModel');
const usuariosModel = require('../models/usuariosModel');
const productosModel = require('../models/productosModel');

const obtenerPedidos = (req, res) => {
  pedidosModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
};

const obtenerPedidoPorId = (req, res) => {
  pedidosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });
    res.json(row);
  });
};

const crearPedido = (req, res) => {
  const { usuarioId, productoId, cantidad, total } = req.body;

  if (!usuarioId || !productoId || !cantidad || !total) {
    return res.status(400).json({ success: false, message: 'usuarioId, productoId, cantidad y total son obligatorios' });
  }

  if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
    return res.status(400).json({ success: false, message: 'cantidad debe ser un número entero mayor a 0' });
  }

  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  usuariosModel.obtenerPorId(usuarioId, (err, usuario) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!usuario) return res.status(404).json({ success: false, message: 'el usuarioId no existe' });

    productosModel.obtenerPorId(productoId, (err, producto) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!producto) return res.status(404).json({ success: false, message: 'el productoId no existe' });

      pedidosModel.insertar({ usuarioId, productoId, cantidad, total }, function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({
          success: true,
          data: { id: this.lastID, usuarioId, productoId, cantidad: Number(cantidad), total: Number(total) }
        });
      });
    });
  });
};

const actualizarPedido = (req, res) => {
  const { usuarioId, productoId, cantidad, total } = req.body;

  if (!usuarioId || !productoId || !cantidad || !total) {
    return res.status(400).json({ success: false, message: 'usuarioId, productoId, cantidad y total son obligatorios' });
  }

  if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
    return res.status(400).json({ success: false, message: 'cantidad debe ser un entero mayor a 0' });
  }

  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  pedidosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });

    pedidosModel.actualizar(req.params.id, { usuarioId, productoId, cantidad, total }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: { id: Number(req.params.id), usuarioId, productoId, cantidad: Number(cantidad), total: Number(total) } });
    });
  });
};

const eliminarPedido = (req, res) => {
  pedidosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'pedido no encontrado' });

    pedidosModel.eliminar(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'pedido eliminado', pedido: row });
    });
  });
};

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};
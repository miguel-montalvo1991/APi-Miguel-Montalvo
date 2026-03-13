// ============================================================
// controllers/ventasController.js - Lógica de negocio: ventas
// ============================================================

const ventasModel = require('../models/ventasModel');
const usuariosModel = require('../models/usuariosModel');

const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia'];
const ESTADOS      = ['completada', 'pendiente', 'cancelada'];

const obtenerVentas = (req, res) => {
  ventasModel.obtenerTodas((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
};

const obtenerVentaPorId = (req, res) => {
  ventasModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });
    res.json(row);
  });
};

const crearVenta = (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  if (!usuarioId || !fecha || !total || !metodoPago) {
    return res.status(400).json({ success: false, message: 'usuarioId, fecha, total y metodoPago son obligatorios' });
  }

  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  if (!METODOS_PAGO.includes(metodoPago)) {
    return res.status(400).json({ success: false, message: `metodoPago debe ser: ${METODOS_PAGO.join(', ')}` });
  }

  const estadoFinal = estado || 'pendiente';
  if (!ESTADOS.includes(estadoFinal)) {
    return res.status(400).json({ success: false, message: `estado debe ser: ${ESTADOS.join(', ')}` });
  }

  usuariosModel.obtenerPorId(usuarioId, (err, usuario) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!usuario) return res.status(404).json({ success: false, message: 'el usuarioId no existe' });

    ventasModel.insertar({ usuarioId, fecha, total, metodoPago, estado: estadoFinal }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({
        success: true,
        data: { id: this.lastID, usuarioId, fecha, total: Number(total), metodoPago, estado: estadoFinal }
      });
    });
  });
};

const actualizarVenta = (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  if (!usuarioId || !fecha || !total || !metodoPago || !estado) {
    return res.status(400).json({ success: false, message: 'usuarioId, fecha, total, metodoPago y estado son obligatorios' });
  }

  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  if (!METODOS_PAGO.includes(metodoPago)) {
    return res.status(400).json({ success: false, message: `metodoPago debe ser: ${METODOS_PAGO.join(', ')}` });
  }

  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ success: false, message: `estado debe ser: ${ESTADOS.join(', ')}` });
  }

  ventasModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });

    ventasModel.actualizar(req.params.id, { usuarioId, fecha, total, metodoPago, estado }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: { id: Number(req.params.id), usuarioId, fecha, total: Number(total), metodoPago, estado } });
    });
  });
};

const eliminarVenta = (req, res) => {
  ventasModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });

    ventasModel.eliminar(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'venta eliminada', venta: row });
    });
  });
};

module.exports = {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
}
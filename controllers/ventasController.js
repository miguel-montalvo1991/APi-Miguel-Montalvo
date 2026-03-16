// ============================================================
// controllers/ventasController.js - Lógica de negocio: ventas
//
// Las ventas tienen validaciones adicionales: metodoPago y estado
// solo pueden ser ciertos valores permitidos, así que los
// verificamos antes de guardar.
// ============================================================

const ventasModel   = require('../models/ventasModel');
const usuariosModel = require('../models/usuariosModel'); // Para verificar que el usuario existe

// Valores permitidos para metodoPago y estado
// Los definimos aquí para no repetirlos en cada función
const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia'];
const ESTADOS      = ['completada', 'pendiente', 'cancelada'];

// GET /ventas → Retorna todas las ventas
const obtenerVentas = (req, res) => {
  ventasModel.obtenerTodas((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows);
  });
};

// GET /ventas/:id → Retorna una venta por ID
const obtenerVentaPorId = (req, res) => {
  ventasModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });
    res.json(row);
  });
};

// POST /ventas → Crea una nueva venta
const crearVenta = (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  // Campos obligatorios (estado no es obligatorio, tiene valor por defecto)
  if (!usuarioId || !fecha || !total || !metodoPago) {
    return res.status(400).json({ success: false, message: 'usuarioId, fecha, total y metodoPago son obligatorios' });
  }

  // El total debe ser un número mayor a 0
  if (isNaN(total) || Number(total) <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  // Verificamos que el método de pago sea uno de los valores permitidos
  if (!METODOS_PAGO.includes(metodoPago)) {
    return res.status(400).json({ success: false, message: `metodoPago debe ser: ${METODOS_PAGO.join(', ')}` });
  }

  // Si no viene el estado, usamos 'pendiente' como valor por defecto
  const estadoFinal = estado || 'pendiente';
  if (!ESTADOS.includes(estadoFinal)) {
    return res.status(400).json({ success: false, message: `estado debe ser: ${ESTADOS.join(', ')}` });
  }

  // Verificamos que el usuario exista
  usuariosModel.obtenerPorId(usuarioId, (err, usuario) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!usuario) return res.status(404).json({ success: false, message: 'el usuarioId no existe' });

    // Si todo está bien, creamos la venta
    ventasModel.insertar({ usuarioId, fecha, total, metodoPago, estado: estadoFinal }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({
        success: true,
        data: { id: this.lastID, usuarioId, fecha, total: Number(total), metodoPago, estado: estadoFinal }
      });
    });
  });
};

// PUT /ventas/:id → Actualiza una venta
const actualizarVenta = (req, res) => {
  const { usuarioId, fecha, total, metodoPago, estado } = req.body;

  // Al actualizar, todos los campos incluyendo estado son obligatorios
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

  // Verificamos que la venta exista antes de actualizar
  ventasModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'venta no encontrada' });

    ventasModel.actualizar(req.params.id, { usuarioId, fecha, total, metodoPago, estado }, function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: { id: Number(req.params.id), usuarioId, fecha, total: Number(total), metodoPago, estado } });
    });
  });
};

// DELETE /ventas/:id → Elimina una venta
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
};
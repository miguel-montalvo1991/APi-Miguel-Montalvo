const express = require('express');
const router = express.Router();
const verificarContrasena = require('../middlewares/auth');
const pedidosController = require('../controllers/pedidosController');

router.get('/',       verificarContrasena, pedidosController.obtenerPedidos);
router.get('/:id',    verificarContrasena, pedidosController.obtenerPedidoPorId);
router.post('/',      verificarContrasena, pedidosController.crearPedido);
router.put('/:id',    verificarContrasena, pedidosController.actualizarPedido);
router.delete('/:id', verificarContrasena, pedidosController.eliminarPedido);

module.exports = router;
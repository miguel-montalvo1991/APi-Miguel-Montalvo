const express = require('express');
const router = express.Router();
const verificarContrasena = require('../middlewares/auth');
const productosController = require('../controllers/productosController');

router.get('/',       verificarContrasena, productosController.obtenerProductos);
router.get('/:id',    verificarContrasena, productosController.obtenerProductoPorId);
router.post('/',      verificarContrasena, productosController.crearProducto);
router.put('/:id',    verificarContrasena, productosController.actualizarProducto);
router.delete('/:id', verificarContrasena, productosController.eliminarProducto);

module.exports = router;
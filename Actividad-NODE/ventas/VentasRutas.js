const express = require('express');
const router = express.Router();
const verificarContrasena = require('../middlewares/auth');
const ventasController = require('../controllers/ventasController');

router.get('/',       verificarContrasena, ventasController.obtenerVentas);
router.get('/:id',    verificarContrasena, ventasController.obtenerVentaPorId);
router.post('/',      verificarContrasena, ventasController.crearVenta);
router.put('/:id',    verificarContrasena, ventasController.actualizarVenta);
router.delete('/:id', verificarContrasena, ventasController.eliminarVenta);

module.exports = router;
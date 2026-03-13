const express = require('express');
const router = express.Router();
const verificarContrasena = require('../middlewares/auth');
const usuariosController = require('../controllers/usuariosController');

router.get('/',       verificarContrasena, usuariosController.obtenerUsuarios);
router.get('/:id',    verificarContrasena, usuariosController.obtenerUsuarioPorId);
router.post('/',      verificarContrasena, usuariosController.crearUsuario);
router.put('/:id',    verificarContrasena, usuariosController.actualizarUsuario);
router.delete('/:id', verificarContrasena, usuariosController.eliminarUsuario);

module.exports = router;
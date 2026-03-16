// ============================================================
// controllers/usuariosController.js - Lógica de negocio: usuarios
//
// Los controladores son la capa del medio entre las rutas y los modelos.
// Aquí van las validaciones (campos obligatorios, formatos, duplicados)
// y el flujo de cada operación.
//
// El controlador recibe la petición, la valida, llama al modelo
// para hablar con la base de datos, y responde al cliente.
// ============================================================

const usuariosModel = require('../models/usuariosModel');

// ------------------------------------------------------------
// GET /usuarios → Retorna todos los usuarios
// ------------------------------------------------------------
const obtenerUsuarios = (req, res) => {
  usuariosModel.obtenerTodos((err, rows) => {
    // err → si hubo un error en la consulta SQL
    // rows → array con todos los usuarios
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(rows); // Respondemos con el array de usuarios
  });
};

// ------------------------------------------------------------
// GET /usuarios/:id → Retorna un usuario por ID
// ------------------------------------------------------------
const obtenerUsuarioPorId = (req, res) => {
  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    // row → el usuario encontrado, o undefined si no existe
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });
    res.json(row);
  });
};

// ------------------------------------------------------------
// POST /usuarios → Crea un nuevo usuario
// ------------------------------------------------------------
const crearUsuario = (req, res) => {
  // Extraemos los datos del body de la petición
  const { nombre, apellido, email, telefono } = req.body;

  // Validación: nombre y email son obligatorios
  if (!nombre || !email) {
    return res.status(400).json({ success: false, message: 'nombre y email son obligatorios' });
  }

  // Verificamos que el email no esté ya registrado
  usuariosModel.obtenerPorEmail(email, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (row) return res.status(400).json({ success: false, message: 'ese email ya está registrado' });

    // Si el email no existe, creamos el usuario
    usuariosModel.insertar({ nombre, apellido, email, telefono }, function(err) {
      // Usamos function() en vez de arrow function para poder usar "this"
      // this.lastID → ID del registro que se acaba de insertar
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ // 201 = Created
        success: true,
        data: { id: this.lastID, nombre, apellido, email, telefono }
      });
    });
  });
};

// ------------------------------------------------------------
// PUT /usuarios/:id → Actualiza un usuario existente
// ------------------------------------------------------------
const actualizarUsuario = (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  // Validación: nombre y email son obligatorios
  if (!nombre || !email) {
    return res.status(400).json({ success: false, message: 'nombre y email son obligatorios' });
  }

  // Verificamos que el usuario que queremos editar exista
  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    // Verificamos que el nuevo email no lo tenga otro usuario diferente
    // (excluyendo al propio usuario que estamos editando)
    usuariosModel.obtenerPorEmailExcluyendo(email, req.params.id, (err, otro) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (otro) return res.status(400).json({ success: false, message: 'ese email ya lo tiene otro usuario' });

      // Si todo está bien, actualizamos
      usuariosModel.actualizar(req.params.id, { nombre, apellido, email, telefono }, function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: { id: Number(req.params.id), nombre, apellido, email, telefono } });
      });
    });
  });
};

// ------------------------------------------------------------
// DELETE /usuarios/:id → Elimina un usuario
// ------------------------------------------------------------
const eliminarUsuario = (req, res) => {
  // Primero verificamos que el usuario exista
  usuariosModel.obtenerPorId(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'usuario no encontrado' });

    // Si existe, lo eliminamos
    usuariosModel.eliminar(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      // Respondemos con el usuario eliminado para confirmar cuál fue
      res.json({ success: true, message: 'usuario eliminado', usuario: row });
    });
  });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
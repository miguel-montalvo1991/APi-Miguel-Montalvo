// ============================================================
// UsuariosRutas.js - Módulo de gestión de usuarios
// Contiene todos los endpoints CRUD para manejar usuarios.
// Cada ruta está protegida por el middleware verificarContrasena.
// ============================================================

const express = require("express");
const router = express.Router();

// ------------------------------------------------------------
// Base de datos simulada en memoria
// En un proyecto real esto vendría de una base de datos (MySQL, MongoDB, etc.)
// Por ahora usamos un arreglo de objetos JavaScript
// ------------------------------------------------------------
const usuarios = [
  { id: 1, Nombre: "carla",       Apellido: "bravo",    email: "@carla.com",  telefono: 35515425   },
  { id: 2, Nombre: "davier",      Apellido: "quinto",   email: "@davier.com", telefono: 2949892    },
  { id: 3, Nombre: "manuela",     Apellido: "cordoba",  email: "@cordabo",    telefono: 1598469    },
  { id: 4, Nombre: "miguel sama", Apellido: "montalvo", email: "@monta.com",  telefono: 4985168765 },
];

// Contraseña requerida para acceder a todos los endpoints
const CONTRASENA = "sena2025";

// ------------------------------------------------------------
// Middleware: verificarContrasena
// Se ejecuta ANTES de cada endpoint para verificar que la
// petición incluya la contraseña correcta en los headers.
// Si la contraseña es incorrecta o no se envía, responde con
// un error 401 (No autorizado) y bloquea el acceso.
// Si es correcta, llama a next() para continuar al endpoint.
// ------------------------------------------------------------
const verificarContrasena = (req, res, next) => {
  const password = req.headers['password'];

  if (!password || password !== CONTRASENA) {
    return res.status(401).json({ error: "Incorrect password, or password not sent" });
  }

  // La contraseña es válida, continuamos con la petición
  next();
};

// ------------------------------------------------------------
// GET /usuarios
// Retorna todos los usuarios. Permite filtrar por cualquier
// campo usando query params en la URL.
// Ejemplo: GET /usuarios?Nombre=carla
// Ejemplo: GET /usuarios?Apellido=bravo&telefono=35515425
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  // Extraemos los posibles filtros de la query string
  const { id, Nombre, Apellido, email, telefono } = req.query;

  // Filtramos el arreglo según los parámetros que se hayan enviado
  // Si un parámetro no se envió, la condición se ignora (retorna true)
  let filteredUsuarios = usuarios.filter(u => {
    return (
      (!id       || u.id == id) &&
      (!Nombre   || u.Nombre.toLowerCase().includes(Nombre.toLowerCase())) &&
      (!Apellido || u.Apellido.toLowerCase().includes(Apellido.toLowerCase())) &&
      (!email    || u.email == email) &&
      (!telefono || u.telefono == telefono)
    );
  });

  // Respondemos con el arreglo filtrado en formato JSON
  res.json(filteredUsuarios);
});

// ------------------------------------------------------------
// GET /usuarios/:id
// Busca y retorna un único usuario por su ID.
// El :id es un parámetro dinámico que viene en la URL.
// Ejemplo: GET /usuarios/1
// Si no existe, responde con error 404.
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  // Buscamos el usuario cuyo id coincida con el parámetro de la URL
  const usuario = usuarios.find((u) => u.id == req.params.id);

  // Si no se encontró el usuario, retornamos error 404
  if (!usuario) return res.status(404).json({ error: "usuario no encontrado" });

  // Respondemos con el usuario encontrado, formateado con indentación
  res.send(JSON.stringify(usuario, null, 2));
});

// ------------------------------------------------------------
// POST /usuarios
// Crea un nuevo usuario con los datos enviados en el body.
// El ID se asigna automáticamente según el tamaño del arreglo.
// Ejemplo de body: { "Nombre": "juan", "Apellido": "perez", "email": "@juan.com", "telefono": 123456 }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  // Separamos el campo password del body (no queremos guardarlo en el usuario)
  // El operador spread (...) copia el resto de propiedades en nuevoUsuario
  const { password, ...nuevoUsuario } = req.body;

  // Asignamos el ID automáticamente
  nuevoUsuario.id = usuarios.length + 1;

  // Agregamos el nuevo usuario al arreglo
  usuarios.push(nuevoUsuario);

  // Respondemos con el usuario creado y código 201 (Created)
  res.status(201).send(JSON.stringify(nuevoUsuario, null, 2));
});

// ------------------------------------------------------------
// PUT /usuarios/:id
// Actualiza los datos de un usuario existente.
// Solo se modifican los campos que se envíen en el body.
// Los demás campos se conservan con el operador spread (...).
// Ejemplo: PUT /usuarios/1 con body { "email": "nuevo@email.com" }
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  // Buscamos el índice del usuario en el arreglo
  const index = usuarios.findIndex((u) => u.id == req.params.id);

  // Si no existe, retornamos error 404
  if (index === -1) return res.status(404).json({ error: "usuario no encontrado" });

  // Combinamos los datos actuales con los nuevos del body
  // Los nuevos sobreescriben los antiguos si tienen el mismo nombre
  usuarios[index] = { ...usuarios[index], ...req.body };

  // Respondemos con el usuario actualizado
  res.send(JSON.stringify(usuarios[index], null, 2));
});

// ------------------------------------------------------------
// DELETE /usuarios/:id
// Elimina un usuario del arreglo por su ID.
// Responde con un mensaje de confirmación y los datos eliminados.
// Ejemplo: DELETE /usuarios/1
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  // Buscamos el índice del usuario a eliminar
  const index = usuarios.findIndex((u) => u.id == req.params.id);

  // Si no existe, retornamos error 404
  if (index === -1) return res.status(404).json({ error: "usuario no encontrado" });

  // splice(index, 1) elimina 1 elemento en la posición encontrada y lo retorna
  const eliminado = usuarios.splice(index, 1);

  // Respondemos con confirmación y los datos del usuario eliminado
  res.json({ mensaje: "usuario eliminado", usuario: eliminado[0] });
});

// Exportamos el router para que index.js pueda usarlo
module.exports = router;
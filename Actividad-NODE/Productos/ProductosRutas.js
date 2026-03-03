// ============================================================
// ProductosRutas.js - Módulo de gestión de productos
// Contiene todos los endpoints CRUD para manejar el catálogo
// de productos. Todas las rutas requieren contraseña.
// ============================================================

const express = require("express");
const router = express.Router();

// ------------------------------------------------------------
// Catálogo de productos almacenado en memoria
// Campos: id, nombre, categoria, precio, stock
// ------------------------------------------------------------
const productos = [
  { id: 1, nombre: "camisa",   categoria: "ropa",       precio: 35000,  stock: 10 },
  { id: 2, nombre: "pantalon", categoria: "ropa",       precio: 60000,  stock: 5  },
  { id: 3, nombre: "tenis",    categoria: "calzado",    precio: 120000, stock: 8  },
  { id: 4, nombre: "mochila",  categoria: "accesorios", precio: 75000,  stock: 3  },
];

const CONTRASENA = "sena2025";

// ------------------------------------------------------------
// Middleware: verificarContrasena
// Verifica que el header 'password' sea correcto antes de
// permitir el acceso a cualquier endpoint del módulo.
// ------------------------------------------------------------
const verificarContrasena = (req, res, next) => {
  const password = req.headers['password'];
  if (!password || password !== CONTRASENA) {
    return res.status(401).json({ error: "Incorrect password, or password not sent" });
  }
  next();
};

// ------------------------------------------------------------
// GET /productos
// Retorna todos los productos. Se pueden aplicar filtros
// mediante query params en la URL.
// Ejemplo: GET /productos?categoria=ropa
// Ejemplo: GET /productos?precio=35000
// ------------------------------------------------------------
router.get('/', verificarContrasena, (req, res) => {
  const { id, nombre, categoria, precio, stock } = req.query;

  let filteredProductos = productos.filter(p => {
    return (
      (!id        || p.id == id) &&
      (!nombre    || p.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!categoria || p.categoria.toLowerCase().includes(categoria.toLowerCase())) &&
      (!precio    || p.precio == precio) &&
      (!stock     || p.stock == stock)
    );
  });

  res.json(filteredProductos);
});

// ------------------------------------------------------------
// GET /productos/:id
// Busca un producto específico por su ID.
// Ejemplo: GET /productos/3
// ------------------------------------------------------------
router.get('/:id', verificarContrasena, (req, res) => {
  const producto = productos.find((p) => p.id == req.params.id);
  if (!producto) return res.status(404).json({ error: "producto no encontrado" });
  res.send(JSON.stringify(producto, null, 2));
});

// ------------------------------------------------------------
// POST /productos
// Agrega un nuevo producto al catálogo.
// El ID se asigna automáticamente.
// Ejemplo de body: { "nombre": "gorra", "categoria": "accesorios", "precio": 25000, "stock": 15 }
// ------------------------------------------------------------
router.post('/', verificarContrasena, (req, res) => {
  // Excluimos el campo password del body antes de guardar
  const { password, ...nuevoProducto } = req.body;
  nuevoProducto.id = productos.length + 1;
  productos.push(nuevoProducto);
  res.status(201).send(JSON.stringify(nuevoProducto, null, 2));
});

// ------------------------------------------------------------
// PUT /productos/:id
// Actualiza un producto existente por su ID.
// Solo se sobreescriben los campos enviados en el body.
// Ejemplo: PUT /productos/2 con body { "stock": 20 }
// ------------------------------------------------------------
router.put('/:id', verificarContrasena, (req, res) => {
  const index = productos.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "producto no encontrado" });
  // Mezclamos los datos actuales con los nuevos
  productos[index] = { ...productos[index], ...req.body };
  res.send(JSON.stringify(productos[index], null, 2));
});

// ------------------------------------------------------------
// DELETE /productos/:id
// Elimina un producto del catálogo por su ID.
// Ejemplo: DELETE /productos/4
// ------------------------------------------------------------
router.delete('/:id', verificarContrasena, (req, res) => {
  const index = productos.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "producto no encontrado" });
  const eliminado = productos.splice(index, 1);
  res.json({ mensaje: "producto eliminado", producto: eliminado[0] });
});

module.exports = router;
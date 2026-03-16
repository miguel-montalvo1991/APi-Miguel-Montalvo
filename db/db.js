// ============================================================
// db/db.js - Conexión a la base de datos SQLite
// Este archivo se encarga de dos cosas:
//   1. Abrir (o crear) el archivo de base de datos SQLite
//   2. Crear todas las tablas si todavía no existen
//
// Se ejecuta una sola vez al iniciar el servidor, y exporta
// la conexión para que los modelos puedan usarla.
// ============================================================

const sqlite3 = require('sqlite3').verbose();
// .verbose() activa mensajes de error más detallados, útil para depurar

// ------------------------------------------------------------
// CONEXIÓN A LA BASE DE DATOS
// Si el archivo "database.db" no existe, SQLite lo crea solo.
// Si ya existe, simplemente lo abre.
// ------------------------------------------------------------
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite conectada correctamente');
  }
});

// ------------------------------------------------------------
// ACTIVAR LLAVES FORÁNEAS
// En SQLite, las restricciones de llaves foráneas (FOREIGN KEY)
// vienen DESACTIVADAS por defecto. Sin esto, podríamos crear
// pedidos con usuarioId o productoId que no existen y SQLite
// no lo impediría. Con este PRAGMA lo activamos.
// ------------------------------------------------------------
db.run('PRAGMA foreign_keys = ON');

// ------------------------------------------------------------
// CREACIÓN DE TABLAS
// Usamos "CREATE TABLE IF NOT EXISTS" para que no falle si
// las tablas ya existen. Se crean en orden: primero las que
// no tienen llaves foráneas (usuarios, productos), luego las
// que sí las tienen (pedidos, ventas).
// ------------------------------------------------------------

// TABLA: usuarios
// No tiene llaves foráneas, se crea primero
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único, se incrementa solo
    nombre   TEXT    NOT NULL,                    -- Obligatorio
    apellido TEXT    NOT NULL,                    -- Obligatorio
    email    TEXT    NOT NULL UNIQUE,             -- Obligatorio y único (no pueden repetirse)
    telefono TEXT                                 -- Opcional
  )
`, (err) => {
  if (err) console.error('Error creando tabla usuarios:', err.message);
  else console.log('Tabla usuarios lista');
});

// TABLA: productos
// No tiene llaves foráneas, se crea antes que pedidos
db.run(`
  CREATE TABLE IF NOT EXISTS productos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT    NOT NULL,
    categoria TEXT    NOT NULL,
    precio    REAL    NOT NULL CHECK(precio > 0),         -- El precio debe ser mayor a 0
    stock     INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0) -- El stock no puede ser negativo
  )
`, (err) => {
  if (err) console.error('Error creando tabla productos:', err.message);
  else console.log('Tabla productos lista');
});

// TABLA: pedidos
// Tiene FK hacia usuarios y productos.
// Si el usuarioId o productoId no existen en sus tablas, SQLite rechaza el registro.
db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId  INTEGER NOT NULL,
    productoId INTEGER NOT NULL,
    cantidad   INTEGER NOT NULL CHECK(cantidad > 0),  -- Mínimo 1 unidad
    total      REAL    NOT NULL CHECK(total > 0),
    FOREIGN KEY (usuarioId)  REFERENCES usuarios(id),  -- El usuario debe existir
    FOREIGN KEY (productoId) REFERENCES productos(id)  -- El producto debe existir
  )
`, (err) => {
  if (err) console.error('Error creando tabla pedidos:', err.message);
  else console.log('Tabla pedidos lista');
});

// TABLA: ventas
// Tiene FK hacia usuarios.
db.run(`
  CREATE TABLE IF NOT EXISTS ventas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId   INTEGER NOT NULL,
    fecha       TEXT    NOT NULL,
    total       REAL    NOT NULL CHECK(total > 0),
    -- metodoPago solo puede ser uno de estos tres valores
    metodoPago  TEXT    NOT NULL CHECK(metodoPago IN ('efectivo', 'tarjeta', 'transferencia')),
    -- estado por defecto es 'pendiente', solo puede ser uno de estos tres
    estado      TEXT    NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('completada', 'pendiente', 'cancelada')),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
  )
`, (err) => {
  if (err) console.error('Error creando tabla ventas:', err.message);
  else console.log('Tabla ventas lista');
});

// Exportamos la conexión para que los modelos puedan importarla
module.exports = db;
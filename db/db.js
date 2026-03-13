// ============================================================
// db.js - Conexión a la base de datos SQLite
// Este archivo crea la conexión y define todas las tablas
// del proyecto con sus restricciones y relaciones.
// Se ejecuta una sola vez al iniciar el servidor.
// ============================================================

const sqlite3 = require('sqlite3').verbose();

// Creamos (o abrimos si ya existe) el archivo de base de datos
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite conectada correctamente');
  }
});

// Activamos las llaves foráneas (en SQLite vienen desactivadas por defecto)
db.run('PRAGMA foreign_keys = ON');

// ------------------------------------------------------------
// Creación de tablas en orden correcto:
// Primero las tablas que NO tienen FK (usuarios, productos)
// Luego las que SÍ tienen FK (pedidos, ventas)
// ------------------------------------------------------------

// TABLA: usuarios
// No tiene llaves foráneas, se crea primero
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre   TEXT    NOT NULL,
    apellido TEXT    NOT NULL,
    email    TEXT    NOT NULL UNIQUE,
    telefono TEXT
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
    precio    REAL    NOT NULL CHECK(precio > 0),
    stock     INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0)
  )
`, (err) => {
  if (err) console.error('Error creando tabla productos:', err.message);
  else console.log('Tabla productos lista');
});

// TABLA: pedidos
// Tiene FK hacia usuarios y productos
db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId  INTEGER NOT NULL,
    productoId INTEGER NOT NULL,
    cantidad   INTEGER NOT NULL CHECK(cantidad > 0),
    total      REAL    NOT NULL CHECK(total > 0),
    FOREIGN KEY (usuarioId)  REFERENCES usuarios(id),
    FOREIGN KEY (productoId) REFERENCES productos(id)
  )
`, (err) => {
  if (err) console.error('Error creando tabla pedidos:', err.message);
  else console.log('Tabla pedidos lista');
});

// TABLA: ventas
// Tiene FK hacia usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS ventas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId   INTEGER NOT NULL,
    fecha       TEXT    NOT NULL,
    total       REAL    NOT NULL CHECK(total > 0),
    metodoPago  TEXT    NOT NULL CHECK(metodoPago IN ('efectivo', 'tarjeta', 'transferencia')),
    estado      TEXT    NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('completada', 'pendiente', 'cancelada')),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
  )
`, (err) => {
  if (err) console.error('Error creando tabla ventas:', err.message);
  else console.log('Tabla ventas lista');
});

// Exportamos la conexión para usarla en todas las rutas
module.exports = db;
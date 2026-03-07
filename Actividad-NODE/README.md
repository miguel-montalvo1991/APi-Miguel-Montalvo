# 🛒 Tienda Virtual — API REST con Node.js + SQLite

Proyecto desarrollado para el programa **Tecnología en Análisis y Desarrollo de Software** del SENA, Centro de Servicios y Gestión Empresarial.

---

## 👥 Equipo de trabajo

| Nombre | Rol |
|--------|-----|
| Davier Andrés Quinto Bejarano | Desarrollador |
| Manuela Córdoba Robledo | Desarrolladora |
| Luis Miguel Montalvo Álvarez | Desarrollador |

---

## 📋 Descripción

API REST construida con **Node.js** y **Express.js** que gestiona una tienda virtual con 4 módulos: usuarios, productos, pedidos y ventas. En esta segunda guía se conectó la API a una base de datos **SQLite** y se implementaron validaciones en todos los endpoints.

---

## 🗂️ Estructura del proyecto

```
Actividad-NODE/
├── index.js
├── db/
│   └── db.js               ← conexión y creación de tablas SQLite
├── database.db             ← se genera automáticamente (no subir a GitHub)
├── Usuarios/
│   └── UsuariosRutas.js
├── Productos/
│   └── ProductosRutas.js
├── Pedidos/
│   └── PedidosRutas.js
├── Ventas/
│   └── VentasRutas.js
├── package.json
└── README.md
```

---

## 🗄️ Modelo de Base de Datos

### Diagrama Entidad-Relación

```
usuarios (PK: id)
    │
    │ 1:N                    1:N
    ├──────────────► pedidos ◄──────────── productos (PK: id)
    │                (FK: usuarioId)
    │                (FK: productoId)
    │
    │ 1:N
    └──────────────► ventas
                     (FK: usuarioId)
```

### Relaciones

| Tabla origen | Tabla destino | Cardinalidad | Descripción |
|-------------|---------------|-------------|-------------|
| usuarios | pedidos | 1 : N | Un usuario puede tener muchos pedidos |
| productos | pedidos | 1 : N | Un producto puede estar en muchos pedidos |
| usuarios | ventas | 1 : N | Un usuario puede tener muchas ventas |

---

## 📋 Diccionario de Datos

### Tabla: `usuarios`

| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| nombre | TEXT | NO | NO | NOT NULL | Nombre del usuario |
| apellido | TEXT | NO | NO | NOT NULL | Apellido del usuario |
| email | TEXT | NO | NO | NOT NULL · UNIQUE | Correo, no se repite |
| telefono | TEXT | NO | NO | — | Número de contacto |

### Tabla: `productos`

| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| nombre | TEXT | NO | NO | NOT NULL | Nombre del producto |
| categoria | TEXT | NO | NO | NOT NULL | Categoría del producto |
| precio | REAL | NO | NO | NOT NULL · CHECK > 0 | Precio de venta |
| stock | INTEGER | NO | NO | NOT NULL · CHECK >= 0 | Unidades disponibles |

### Tabla: `pedidos`

| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| usuarioId | INTEGER | NO | SI | NOT NULL · → usuarios.id | Usuario que pidió |
| productoId | INTEGER | NO | SI | NOT NULL · → productos.id | Producto pedido |
| cantidad | INTEGER | NO | NO | NOT NULL · CHECK > 0 | Unidades pedidas |
| total | REAL | NO | NO | NOT NULL · CHECK > 0 | Valor total |

### Tabla: `ventas`

| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| usuarioId | INTEGER | NO | SI | NOT NULL · → usuarios.id | Usuario comprador |
| fecha | TEXT | NO | NO | NOT NULL | Fecha (YYYY-MM-DD) |
| total | REAL | NO | NO | NOT NULL · CHECK > 0 | Valor total |
| metodoPago | TEXT | NO | NO | NOT NULL · CHECK IN lista | efectivo, tarjeta, transferencia |
| estado | TEXT | NO | NO | DEFAULT pendiente | completada, pendiente, cancelada |

---

## ✅ Validaciones implementadas

### Usuarios
- `nombre` y `email` son obligatorios
- El `email` no puede estar repetido (unicidad)

### Productos
- `nombre`, `categoria`, `precio` y `stock` son obligatorios
- `precio` debe ser un número mayor a 0
- `stock` debe ser un entero mayor o igual a 0

### Pedidos
- `usuarioId`, `productoId`, `cantidad` y `total` son obligatorios
- `cantidad` debe ser un entero mayor a 0
- `total` debe ser un número mayor a 0
- El `usuarioId` debe existir en la tabla usuarios
- El `productoId` debe existir en la tabla productos

### Ventas
- `usuarioId`, `fecha`, `total` y `metodoPago` son obligatorios
- `total` debe ser un número mayor a 0
- `metodoPago` solo acepta: `efectivo`, `tarjeta`, `transferencia`
- `estado` solo acepta: `completada`, `pendiente`, `cancelada`
- El `usuarioId` debe existir en la tabla usuarios

---

## 🚀 Cómo correr el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/miguel-montalvo1991/Actividad-NODE

# 2. Instalar dependencias
npm install

# 3. Correr el servidor
node index.js
```

El servidor queda corriendo en `http://localhost:3000` y la base de datos `database.db` se genera automáticamente.

---

## 🔐 Autenticación

Todos los endpoints requieren el siguiente header:

```
password: sena2025
```

---

## 📡 Endpoints disponibles

### Usuarios `/usuarios`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /usuarios | Obtener todos los usuarios |
| GET | /usuarios/:id | Obtener un usuario por ID |
| POST | /usuarios | Crear un nuevo usuario |
| PUT | /usuarios/:id | Actualizar un usuario |
| DELETE | /usuarios/:id | Eliminar un usuario |

### Productos `/productos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /productos | Obtener todos los productos |
| GET | /productos/:id | Obtener un producto por ID |
| POST | /productos | Crear un nuevo producto |
| PUT | /productos/:id | Actualizar un producto |
| DELETE | /productos/:id | Eliminar un producto |

### Pedidos `/pedidos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /pedidos | Obtener todos los pedidos |
| GET | /pedidos/:id | Obtener un pedido por ID |
| POST | /pedidos | Crear un nuevo pedido |
| PUT | /pedidos/:id | Actualizar un pedido |
| DELETE | /pedidos/:id | Eliminar un pedido |

### Ventas `/ventas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /ventas | Obtener todas las ventas |
| GET | /ventas/:id | Obtener una venta por ID |
| POST | /ventas | Crear una nueva venta |
| PUT | /ventas/:id | Actualizar una venta |
| DELETE | /ventas/:id | Eliminar una venta |

---

## 🛠️ Tecnologías usadas

- Node.js
- Express.js
- SQLite3
- Postman (pruebas)

---

*SENA — Centro de Servicios y Gestión Empresarial · Guía N°2 · 2025*
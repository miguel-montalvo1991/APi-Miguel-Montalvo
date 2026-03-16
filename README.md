# 🛒 Tienda Virtual — API REST + Panel de Gestión

Proyecto desarrollado en el **SENA** como parte del proceso formativo en **Análisis y Desarrollo de Software (ADSO)**.

Consiste en una **API REST** construida con Node.js y Express, conectada a una base de datos SQLite, y un **frontend en React + Vite** que funciona como panel de gestión de la tienda.

---

## 👥 Equipo de trabajo

| Nombre | Rol |
|---|---|
| Manuela Córdoba Robledo | Aprendiz ADSO |
| Davier Andrés Quinto Bejarano | Aprendiz ADSO |
| Luis Miguel Montalvo Álvarez | Aprendiz ADSO |

- **Ficha:** 3229209
- **Instructor:** Mateo Arroyave
- **Centro de formación:** SENA — Tecnología en Análisis y Desarrollo de Software
- **Trimestre:** Tercer trimestre — 2026

---

## 🌐 URLs del proyecto desplegado

| Servicio | URL |
|---|---|
| Frontend (Netlify) | https://api-miguel-montalvo.netlify.app |
| Backend (Render) | https://api-miguel-montalvo.onrender.com |

> ⚠️ El backend está en el plan gratuito de Render. La primera petición puede tardar hasta 50 segundos mientras el servidor despierta.

---

## 📁 Estructura del proyecto

```
api-miguel-montalvo/
│
├── index.js                        # Punto de entrada del servidor
├── database.db                     # Base de datos SQLite (se genera automáticamente)
├── package.json
│
├── db/
│   └── db.js                       # Conexión a SQLite y creación de tablas
│
├── middlewares/
│   └── auth.js                     # Middleware de autenticación centralizado
│
├── models/                         # Capa de acceso a datos (consultas SQL)
│   ├── usuariosModel.js
│   ├── productosModel.js
│   ├── pedidosModel.js
│   └── ventasModel.js
│
├── controllers/                    # Lógica de negocio y validaciones
│   ├── usuariosController.js
│   ├── productosController.js
│   ├── pedidosController.js
│   └── ventasController.js
│
├── routes/                         # Definición de rutas
│   ├── usuariosRutas.js
│   ├── productosRutas.js
│   ├── pedidosRutas.js
│   └── ventasRutas.js
│
└── frontend/
    └── frontend-tienda/            # Aplicación React + Vite (panel de gestión)
        ├── src/
        │   └── App.jsx             # Componente principal con toda la lógica del frontend
        ├── index.html
        └── dist/                   # Build listo para producción
```

---

## ⚙️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución del backend |
| Express | Framework para la API REST |
| SQLite3 | Base de datos local |
| CORS | Comunicación entre frontend y backend |
| dotenv | Variables de entorno |
| React | Librería para el frontend |
| Vite | Empaquetador del frontend |
| Tailwind CSS | Estilos del frontend |
| Netlify | Despliegue del frontend |
| Render | Despliegue del backend |

---

## 🚀 Cómo ejecutar el proyecto en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/miguel-montalvo1991/APi-Miguel-Montalvo.git
cd APi-Miguel-Montalvo
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Crear el archivo de variables de entorno

Crear un archivo `.env` en la raíz del proyecto con este contenido:

```
API_PASSWORD=sena2026
PORT=3000
```

### 4. Iniciar el servidor backend

```bash
node index.js
```

El servidor queda corriendo en: `http://localhost:3000`

Si todo está bien, verás esto en la terminal:

```
Base de datos SQLite conectada correctamente
Tabla usuarios lista
Tabla productos lista
Tabla pedidos lista
Tabla ventas lista
Servidor corriendo en puerto 3000
```

### 5. Iniciar el frontend (en otra terminal)

```bash
cd frontend/frontend-tienda
npm install
npm run dev
```

El frontend queda disponible en: `http://localhost:5173`

---

## 🔐 Autenticación

Todas las rutas de la API están protegidas por un middleware de autenticación. Se debe enviar el siguiente header en cada petición:

```
password: sena2026
```

Si no se envía o es incorrecto, la API responde con:

```json
{ "error": "Incorrect password, or password not sent" }
```

---

## 📌 Endpoints disponibles

Todos los módulos siguen el mismo patrón REST:

### 👤 Usuarios — `/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| GET | /usuarios | Retorna todos los usuarios |
| GET | /usuarios/:id | Busca un usuario por ID |
| POST | /usuarios | Crea un nuevo usuario |
| PUT | /usuarios/:id | Actualiza un usuario |
| DELETE | /usuarios/:id | Elimina un usuario |

**Ejemplo body POST/PUT:**
```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan@mail.com",
  "telefono": "3001234567"
}
```

---

### 📦 Productos — `/productos`

| Método | Ruta | Descripción |
|---|---|---|
| GET | /productos | Retorna todos los productos |
| GET | /productos/:id | Busca un producto por ID |
| POST | /productos | Crea un nuevo producto |
| PUT | /productos/:id | Actualiza un producto |
| DELETE | /productos/:id | Elimina un producto |

**Ejemplo body POST/PUT:**
```json
{
  "nombre": "Gorra",
  "categoria": "Accesorios",
  "precio": 25000,
  "stock": 15
}
```

---

### 🛒 Pedidos — `/pedidos`

| Método | Ruta | Descripción |
|---|---|---|
| GET | /pedidos | Retorna todos los pedidos |
| GET | /pedidos/:id | Busca un pedido por ID |
| POST | /pedidos | Crea un nuevo pedido |
| PUT | /pedidos/:id | Actualiza un pedido |
| DELETE | /pedidos/:id | Elimina un pedido |

**Ejemplo body POST/PUT:**
```json
{
  "usuarioId": 1,
  "productoId": 2,
  "cantidad": 3,
  "total": 75000
}
```

---

### 💰 Ventas — `/ventas`

| Método | Ruta | Descripción |
|---|---|---|
| GET | /ventas | Retorna todas las ventas |
| GET | /ventas/:id | Busca una venta por ID |
| POST | /ventas | Crea una nueva venta |
| PUT | /ventas/:id | Actualiza una venta |
| DELETE | /ventas/:id | Elimina una venta |

**Ejemplo body POST/PUT:**
```json
{
  "usuarioId": 1,
  "fecha": "2026-03-10",
  "total": 60000,
  "metodoPago": "tarjeta",
  "estado": "completada"
}
```

Valores permitidos:
- `metodoPago`: `efectivo`, `tarjeta`, `transferencia`
- `estado`: `completada`, `pendiente`, `cancelada`

---

## 🗄️ Base de datos

Las tablas se crean automáticamente al iniciar el servidor. El esquema es el siguiente:

```sql
-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre   TEXT    NOT NULL,
  apellido TEXT    NOT NULL,
  email    TEXT    NOT NULL UNIQUE,
  telefono TEXT
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT    NOT NULL,
  categoria TEXT    NOT NULL,
  precio    REAL    NOT NULL CHECK(precio > 0),
  stock     INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0)
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuarioId  INTEGER NOT NULL,
  productoId INTEGER NOT NULL,
  cantidad   INTEGER NOT NULL CHECK(cantidad > 0),
  total      REAL    NOT NULL CHECK(total > 0),
  FOREIGN KEY (usuarioId)  REFERENCES usuarios(id),
  FOREIGN KEY (productoId) REFERENCES productos(id)
);

-- Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuarioId   INTEGER NOT NULL,
  fecha       TEXT    NOT NULL,
  total       REAL    NOT NULL CHECK(total > 0),
  metodoPago  TEXT    NOT NULL CHECK(metodoPago IN ('efectivo', 'tarjeta', 'transferencia')),
  estado      TEXT    NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('completada', 'pendiente', 'cancelada')),
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);
```

---

## 📖 Diccionario de datos

### 👤 Tabla: `usuarios`

| Clave | Campo | Tipo | Nulo | Default | Restricción | Descripción |
|---|---|---|---|---|---|---|
| PK | id | INTEGER | NO | AUTOINCREMENT | PRIMARY KEY | Identificador único |
| | nombre | TEXT | NO | — | NOT NULL | Nombre del usuario |
| | apellido | TEXT | NO | — | NOT NULL | Apellido del usuario |
| | email | TEXT | NO | — | UNIQUE NOT NULL | Correo electrónico |
| | telefono | TEXT | SÍ | NULL | — | Teléfono de contacto |

### 📦 Tabla: `productos`

| Clave | Campo | Tipo | Nulo | Default | Restricción | Descripción |
|---|---|---|---|---|---|---|
| PK | id | INTEGER | NO | AUTOINCREMENT | PRIMARY KEY | Identificador único |
| | nombre | TEXT | NO | — | NOT NULL | Nombre del producto |
| | categoria | TEXT | NO | — | NOT NULL | Categoría del producto |
| | precio | REAL | NO | — | CHECK > 0 | Precio unitario |
| | stock | INTEGER | NO | 0 | CHECK >= 0 | Unidades disponibles |

### 🛒 Tabla: `pedidos`

| Clave | Campo | Tipo | Nulo | Default | Restricción | Descripción |
|---|---|---|---|---|---|---|
| PK | id | INTEGER | NO | AUTOINCREMENT | PRIMARY KEY | Identificador único |
| FK | usuarioId | INTEGER | NO | — | REFERENCES usuarios(id) | Usuario que hace el pedido |
| FK | productoId | INTEGER | NO | — | REFERENCES productos(id) | Producto pedido |
| | cantidad | INTEGER | NO | — | CHECK > 0 | Cantidad de unidades |
| | total | REAL | NO | — | CHECK > 0 | Valor total del pedido |

### 💰 Tabla: `ventas`

| Clave | Campo | Tipo | Nulo | Default | Restricción | Descripción |
|---|---|---|---|---|---|---|
| PK | id | INTEGER | NO | AUTOINCREMENT | PRIMARY KEY | Identificador único |
| FK | usuarioId | INTEGER | NO | — | REFERENCES usuarios(id) | Usuario de la venta |
| | fecha | TEXT | NO | — | NOT NULL | Fecha de la venta |
| | total | REAL | NO | — | CHECK > 0 | Valor total de la venta |
| | metodoPago | TEXT | NO | — | CHECK IN (...) | Método de pago |
| | estado | TEXT | NO | pendiente | CHECK IN (...) | Estado de la venta |

---

## 📊 Diagrama Entidad–Relación

```
usuarios  ──────1──────<  pedidos  >──────1──────  productos
    │
    └──────1──────<  ventas
```

**Relaciones:**
- Un **usuario** puede tener muchos **pedidos** (1:N)
- Un **producto** puede aparecer en muchos **pedidos** (1:N)
- Un **usuario** puede tener muchas **ventas** (1:N)

---

## 🏗️ Arquitectura del proyecto

El proyecto aplica una separación en **3 capas** por módulo:

```
Rutas  →  Controladores  →  Modelos  →  Base de datos
```

- **Rutas:** solo definen las URLs y qué controlador atiende cada una
- **Controladores:** contienen las validaciones y la lógica de negocio
- **Modelos:** se encargan únicamente de las consultas SQL

Esto hace el código más organizado, fácil de mantener y de escalar.

---

## 🧪 Pruebas con Postman

Para probar los endpoints se puede usar Postman. Hay que recordar siempre incluir el header de autenticación:

```
Key:   password
Value: sena2026
```

Ejemplo de prueba para crear un usuario:
- Método: `POST`
- URL: `https://api-miguel-montalvo.onrender.com`
- Header: `password: sena2026`
- Body (JSON):
```json
{
  "nombre": "Luis",
  "apellido": "Montalvo",
  "email": "luis@mail.com",
  "telefono": "3001234567"
}
```

---

## 💭 Reflexión del equipo

Durante el desarrollo de esta actividad aprendimos a conectar Node.js con SQLite usando el módulo `sqlite3`, a organizar el código en capas (rutas, controladores y modelos) y a proteger los endpoints con un middleware de autenticación. También aprendimos a desplegar el backend en Render y el frontend en Netlify, y a configurar correctamente el CORS para que ambos servicios se puedan comunicar. Entendimos la importancia de activar las llaves foráneas en SQLite con `PRAGMA foreign_keys = ON` ya que vienen desactivadas por defecto. Fue un proceso de mucho ensayo y error pero logramos que todo funcionara correctamente.

---


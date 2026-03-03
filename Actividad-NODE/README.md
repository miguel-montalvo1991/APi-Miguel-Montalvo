# API REST con Express.js

Este proyecto es una API REST básica hecha con Node.js y Express. Maneja cuatro módulos: usuarios, productos, pedidos y ventas. Los datos se guardan en memoria (arrays), no hay base de datos por ahora.

Lo hice como ejercicio para practicar rutas, middlewares y los métodos HTTP (GET, POST, PUT, DELETE).

---

## Requisitos

- Node.js instalado
- npm

---

## Cómo correrlo

```bash
npm install
node index.js
```

El servidor queda corriendo en: `http://localhost:3000`

---

## Autenticación

Todos los endpoints están protegidos por un middleware que verifica una contraseña. Hay que enviarla en los **headers** de cada petición:

| Header     | Valor      |
|------------|------------|
| `password` | `sena2025` |

Si no se manda o es incorrecta, el servidor responde con un error `401`.

---

## Estructura del proyecto

```
/
├── index.js
├── Usuarios/
│   └── UsuariosRutas.js
├── Productos/
│   └── ProductosRutas.js
├── Pedidos/
│   └── PedidosRutas.js
└── Ventas/
    └── VentasRutas.js
```

---

## Endpoints

Todos los módulos tienen los mismos 5 endpoints. Cambia solo el recurso (`/usuarios`, `/productos`, `/pedidos`, `/ventas`).

### GET /recurso
Retorna todos los registros. Se pueden filtrar por cualquier campo usando query params.

```
GET /usuarios?Nombre=carla
GET /productos?categoria=ropa
GET /pedidos?usuario=davier
GET /ventas?estado=completada&metodoPago=efectivo
```

### GET /recurso/:id
Retorna un solo registro buscado por su ID.

```
GET /usuarios/1
GET /productos/3
```

### POST /recurso
Crea un nuevo registro. Los datos van en el body en formato JSON. El ID se asigna automáticamente.

```json
// POST /usuarios
{
  "Nombre": "laura",
  "Apellido": "gomez",
  "email": "@laura.com",
  "telefono": 3001234567
}
```

```json
// POST /productos
{
  "nombre": "gorra",
  "categoria": "accesorios",
  "precio": 25000,
  "stock": 15
}
```

```json
// POST /pedidos
{
  "usuario": "laura",
  "producto": "camisa",
  "cantidad": 1,
  "total": 35000
}
```

```json
// POST /ventas
{
  "fecha": "2025-03-01",
  "usuario": "laura",
  "total": 60000,
  "metodoPago": "tarjeta",
  "estado": "completada"
}
```

### PUT /recurso/:id
Actualiza un registro existente. Solo se modifican los campos que se manden, los demás quedan igual.

```json
// PUT /productos/2
{
  "stock": 20
}
```

```json
// PUT /ventas/3
{
  "estado": "completada"
}
```

### DELETE /recurso/:id
Elimina un registro por su ID. Responde con el objeto eliminado como confirmación.

```
DELETE /usuarios/1
DELETE /pedidos/3
```

---

## Campos por módulo

### Usuarios
| Campo    | Tipo   | Descripción         |
|----------|--------|---------------------|
| id       | number | Asignado automático |
| Nombre   | string |                     |
| Apellido | string |                     |
| email    | string |                     |
| telefono | number |                     |

### Productos
| Campo     | Tipo   | Descripción         |
|-----------|--------|---------------------|
| id        | number | Asignado automático |
| nombre    | string |                     |
| categoria | string |                     |
| precio    | number | En pesos colombianos|
| stock     | number |                     |

### Pedidos
| Campo    | Tipo   | Descripción         |
|----------|--------|---------------------|
| id       | number | Asignado automático |
| usuario  | string |                     |
| producto | string |                     |
| cantidad | number |                     |
| total    | number | En pesos colombianos|

### Ventas
| Campo      | Tipo   | Descripción                              |
|------------|--------|------------------------------------------|
| id         | number | Asignado automático                      |
| fecha      | string | Formato YYYY-MM-DD                       |
| usuario    | string |                                          |
| total      | number | En pesos colombianos                     |
| metodoPago | string | efectivo, tarjeta o transferencia        |
| estado     | string | completada, pendiente o cancelada        |

---

## Notas

- Los datos se guardan en memoria, si se reinicia el servidor se pierden los cambios.
- El campo `password` que se mande en el body no se guarda en ningún registro.
- Los filtros del GET son opcionales y se pueden combinar.
# 🛒 Tienda Virtual — Frontend

Panel de gestión visual desarrollado con **React + Vite + Tailwind CSS** para administrar la API REST de la Tienda Virtual del SENA.

---

## 👥 Equipo de trabajo

| Nombre | Rol |
|--------|-----|
| Davier Andrés Quinto Bejarano | Desarrollador |
| Manuela Córdoba Robledo | Desarrolladora |
| Luis Miguel Montalvo Álvarez | Desarrollador |

---

## 📋 Descripción

Este proyecto es el frontend del sistema de gestión de la Tienda Virtual. Se conecta al backend (API REST con Node.js + SQLite) y permite gestionar las 4 entidades del sistema desde una interfaz visual moderna: **usuarios, productos, pedidos y ventas**.

---

## 🗂️ Estructura del proyecto

```
frontend-tienda/
├── src/
│   ├── App.jsx        ← componente principal con toda la lógica
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## ⚙️ Funcionalidades

- Ver todos los registros de cada módulo en tablas
- Crear nuevos registros con formularios validados
- Editar registros existentes
- Eliminar registros con confirmación
- Mensajes de éxito y error automáticos
- Diseño oscuro moderno y responsive

---

## 🛠️ Tecnologías usadas

| Tecnología | Versión | Para qué se usa |
|-----------|---------|-----------------|
| React | v18+ | Framework de UI |
| Vite | v5+ | Bundler y servidor de desarrollo |
| Tailwind CSS | v3.x | Estilos utilitarios |
| Fetch API | nativa | Peticiones al backend |

---

## 🚀 Cómo correr el proyecto

### Requisito previo
El backend debe estar corriendo antes de iniciar el frontend:

```bash
# En otra terminal, dentro de Actividad-NODE
node index.js
```

### Instalar y correr el frontend

```bash
# 1. Clonar el repositorio
git clone https://github.com/miguel-montalvo1991/Actividad-NODE

# 2. Entrar a la carpeta del frontend
cd frontend-tienda

# 3. Instalar dependencias
npm install

# 4. Correr el servidor de desarrollo
npm run dev
```

El frontend queda disponible en `http://localhost:5173`

---

## 🔗 Conexión con el backend

El frontend se conecta automáticamente al backend en:

```
http://localhost:3000
```

Todas las peticiones incluyen el header de autenticación:

```
password: sena2025
```

El backend debe tener **CORS habilitado** con el módulo `cors` para permitir la conexión desde el frontend.

---

## 📡 Módulos disponibles

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| 👤 Usuarios | `/usuarios` | Gestión de clientes |
| 📦 Productos | `/productos` | Catálogo de productos |
| 🛒 Pedidos | `/pedidos` | Pedidos realizados |
| 💰 Ventas | `/ventas` | Historial de ventas |

---

## 📸 Vista del proyecto

El panel cuenta con:
- Navegación por tabs para cada módulo
- Tablas con todos los registros
- Botones de editar y eliminar por fila
- Modal con formulario para crear y editar
- Indicador de conexión con el API

---

*SENA — Centro de Servicios y Gestión Empresarial · ADSO · 2025*
# MultiShop E-commerce

## 🚀 Descripción
MultiShop es una aplicación de comercio electrónico desarrollada con Node.js y Express, que ofrece una experiencia de compra completa con características como carrito de compras en tiempo real, gestión de productos, y sistema de ofertas. El proyecto implementa persistencia en MongoDB, sistema de sesiones, y actualizaciones en tiempo real.

## ✨ Características Principales
- Catálogo de productos con:
  - Paginación dinámica
  - Filtros por categoría y disponibilidad
  - Ordenamiento por precio
  - Sistema de ofertas con 10% de descuento
- Carrito de compras en tiempo real:
  - Actualización automática de cantidades
  - Cálculo de subtotales y descuentos
  - Proceso de checkout
  - Validación de stock
- Panel de administración para:
  - Gestión de productos
  - Control de stock
  - Monitoreo de ventas
- Diseño responsive con Bootstrap 5
- Persistencia en MongoDB
- WebSockets para actualizaciones en tiempo real

## 🛠️ Tecnologías Utilizadas
- **Node.js** (v14.0.0 o superior)
- **Express** (v4.21.2)
- **MongoDB** con Mongoose (v8.1.0)
- **Socket.IO** (v4.7.4)
- **Express-Handlebars** (v7.1.2)
- **Express-Session** con Connect-Mongo
- **Bootstrap** (v5.3.0)
- **Bootstrap Icons** (v1.11.0)

## 📋 Requisitos Previos
1. Node.js >=14.0.0
2. MongoDB instalado y corriendo
3. npm o yarn
4. Git

## 🔧 Instalación y Configuración

1. Clonar el repositorio:
\`\`\`bash
git clone <URL_DEL_REPOSITORIO>
cd multishop-ecommerce
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
Crear archivo `.env` en la raíz:
\`\`\`env
# MongoDB URI (requerido)
MONGODB_URI=mongodb://localhost:27017/multishop

# Puerto del servidor (opcional, default: 8080)
PORT=8080

# Secreto para sesiones (requerido)
SESSION_SECRET=tu_secreto_aqui
\`\`\`

4. Cargar datos de prueba:
\`\`\`bash
npm run loadProducts
\`\`\`

5. Iniciar el servidor:
\`\`\`bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
\`\`\`

## 🌐 Endpoints API

### Productos

\`\`\`
GET /api/products
- Obtener productos con filtros
- Query params:
  - page (default: 1)
  - limit (default: 10)
  - sort (asc/desc)
  - category
  - status (true/false)
  - minPrice
  - maxPrice
- Respuesta: {
    status: 'success',
    payload: {
      docs: [...],
      totalDocs,
      limit,
      totalPages,
      page,
      ...
    }
  }

GET /api/products/:pid
- Obtener producto por ID
- Respuesta: {
    status: 'success',
    payload: {
      _id,
      title,
      description,
      price,
      ...
    }
  }

POST /api/products
- Crear producto
- Body: {
    title: String (required),
    description: String (required),
    code: String (required, unique),
    price: Number (required, min: 0),
    stock: Number (required, min: 0),
    category: String (required),
    thumbnails: [String],
    status: Boolean (default: true),
    onSale: Boolean (default: false)
  }

PUT /api/products/:pid
- Actualizar producto
- Body: Igual que POST

DELETE /api/products/:pid
- Eliminar producto
\`\`\`

### Carritos

\`\`\`
POST /api/carts
- Crear carrito
- Respuesta: { status: 'success', payload: { _id, products: [] } }

GET /api/carts/:cid
- Obtener carrito con productos populados
- Respuesta: {
    status: 'success',
    payload: {
      cart: { _id, products: [...] },
      total,
      subtotal,
      savings
    }
  }

POST /api/carts/:cid/products/:pid
- Agregar producto al carrito
- Body: { quantity: Number (min: 1) }
- Validaciones:
  - Stock disponible
  - Producto existe
  - Carrito existe

PUT /api/carts/:cid/products/:pid
- Actualizar cantidad
- Body: { quantity: Number (min: 1) }
- Validaciones:
  - Stock disponible
  - Producto existe en carrito

DELETE /api/carts/:cid/products/:pid
- Eliminar producto del carrito

DELETE /api/carts/:cid
- Vaciar carrito

POST /api/carts/:cid/checkout
- Finalizar compra
- Validaciones:
  - Stock disponible
  - Productos existen
- Acciones:
  - Actualiza stock
  - Marca carrito como completado
  - Crea nuevo carrito vacío
\`\`\`

### Vistas

\`\`\`
GET /
- Home con listado de productos
- Filtros y paginación
- Sistema de ofertas

GET /products/:pid
- Detalle de producto
- Galería de imágenes
- Agregar al carrito

GET /cart
- Vista del carrito
- Gestión de cantidades
- Checkout

GET /admin
- Panel de administración
- CRUD de productos
- Gestión de stock
\`\`\`

## 📦 Estructura del Proyecto

\`\`\`
src/
├── config/
│   └── database.config.js    # Configuración MongoDB
├── controllers/
│   ├── cart.controller.js    # Lógica de carritos
│   ├── product.controller.js # Lógica de productos
│   └── view.controller.js    # Lógica de vistas
├── models/
│   ├── cart.model.js        # Esquema de carritos
│   └── product.model.js     # Esquema de productos
├── routes/
│   ├── cart.routes.js       # Rutas de carritos
│   ├── product.routes.js    # Rutas de productos
│   └── view.routes.js       # Rutas de vistas
├── scripts/
│   └── loadProducts.js      # Script de carga inicial
├── utils/
│   └── handlebars.helpers.js # Helpers de Handlebars
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Layout principal
│   ├── cart.handlebars      # Vista de carrito
│   ├── home.handlebars      # Vista principal
│   ├── product.handlebars   # Detalle de producto
│   └── admin.handlebars     # Panel admin
└── app.js                   # Entrada de la aplicación

public/
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   └── main.js            # JavaScript cliente
└── img/                   # Imágenes estáticas
\`\`\`

## 🔍 Características Detalladas

### Sistema de Ofertas
- Productos marcables en oferta
- Descuento automático del 10%
- Cálculo de ahorro en carrito
- Destacado visual de ofertas

### Gestión de Stock
- Validación en tiempo real
- Actualización automática
- Notificaciones de cambios
- Prevención de sobreventas

### Carrito en Tiempo Real
- Actualización instantánea
- Cálculo automático de totales
- Persistencia en sesión
- Proceso de checkout seguro

## 🧪 Testing
Para ejecutar los tests:
\`\`\`bash
npm test
\`\`\`
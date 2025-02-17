# MultiShop E-commerce

## 🚀 Descripción
MultiShop es una aplicación de comercio electrónico desarrollada con Node.js y Express, que ofrece una experiencia de compra completa con características como carrito de compras en tiempo real, gestión de productos, y sistema de ofertas.

## ✨ Características Principales
- Catálogo de productos con paginación y filtros
- Carrito de compras en tiempo real
- Sistema de ofertas y descuentos
- Panel de administración
- Actualizaciones en tiempo real con Socket.IO
- Diseño responsive
- Persistencia de datos en MongoDB

## 🛠️ Tecnologías Utilizadas
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **Socket.IO** - Comunicación en tiempo real
- **Handlebars** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía

## 📋 Requisitos Previos
- Node.js >=14.0.0
- MongoDB
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone <URL_DEL_REPOSITORIO>
cd multishop-ecommerce
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Crear archivo .env en la raíz del proyecto:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/multishop
PORT=8080
SESSION_SECRET=tu_secreto_aqui
\`\`\`

4. Cargar productos de prueba:
\`\`\`bash
npm run loadProducts
\`\`\`

5. Iniciar el servidor:
\`\`\`bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
\`\`\`

## 🌐 Endpoints API

### Productos

\`\`\`
GET /api/products
- Obtener todos los productos
- Query params:
  - page: Número de página
  - limit: Productos por página
  - sort: Ordenar por precio (asc/desc)
  - category: Filtrar por categoría
  - status: Filtrar por disponibilidad
  - minPrice: Precio mínimo
  - maxPrice: Precio máximo

GET /api/products/:pid
- Obtener un producto específico

POST /api/products
- Crear nuevo producto
- Body: {
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String],
    status: Boolean,
    onSale: Boolean
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
- Crear nuevo carrito

GET /api/carts/:cid
- Obtener carrito y sus productos

POST /api/carts/:cid/products/:pid
- Agregar producto al carrito
- Body: { quantity: Number }

PUT /api/carts/:cid/products/:pid
- Actualizar cantidad de producto
- Body: { quantity: Number }

DELETE /api/carts/:cid/products/:pid
- Eliminar producto del carrito

DELETE /api/carts/:cid
- Vaciar carrito

POST /api/carts/:cid/checkout
- Finalizar compra
\`\`\`

### Vistas

\`\`\`
GET /
- Página principal con listado de productos

GET /products/:pid
- Detalle de producto

GET /cart
- Vista del carrito

GET /admin
- Panel de administración
\`\`\`

## 📦 Estructura del Proyecto

\`\`\`
src/
├── config/         # Configuración de la base de datos
├── controllers/    # Controladores de la aplicación
├── models/         # Modelos de Mongoose
├── routes/         # Rutas de la API
├── scripts/        # Scripts de utilidad
├── utils/          # Utilidades y helpers
├── views/          # Plantillas Handlebars
└── app.js         # Punto de entrada de la aplicación

public/
├── css/           # Estilos CSS
├── js/            # JavaScript del cliente
└── img/           # Imágenes estáticas
\`\`\`

## 🔍 Características Detalladas

### Sistema de Ofertas
- Los productos pueden marcarse en oferta
- Descuento automático del 10% en productos en oferta
- Cálculo automático de ahorro en el carrito

### Gestión de Stock
- Actualización automática de stock al realizar compras
- Validación de stock disponible
- Notificaciones en tiempo real de cambios de stock

### Carrito en Tiempo Real
- Actualización instantánea de cantidades
- Cálculo automático de totales
- Persistencia de carrito en sesión

## 👥 Contribución
Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles. 
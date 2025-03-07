# MultiShop E-commerce

## Descripción
E-commerce desarrollado con Node.js, Express y MongoDB. Incluye gestión de productos, carrito en tiempo real y panel de administración.

## Características
- Catálogo de productos con filtros y paginación
- Carrito de compras en tiempo real
- Panel de administración
- Sistema de ofertas (10% descuento)
- Diseño responsive (Bootstrap 5)
- Autenticación de usuarios con JWT
- Roles de usuario (admin/user)
- Protección de rutas sensibles

## Tecnologías
- Node.js >=14.0.0
- Express 4.21.2
- MongoDB + Mongoose 8.1.0
- Socket.IO 4.7.4
- Express-Handlebars 7.1.2
- Bootstrap 5.3.0
- Passport.js + JWT
- Bcrypt para encriptación

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/bautistabozzer/ProyectoBackend01.git
cd ProyectoBackend01
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/multishop
PORT=8080
SESSION_SECRET=tu_secreto_aqui
JWT_SECRET=tu_jwt_secreto_aqui
JWT_EXPIRES_IN=24h
```

4. Cargar productos de prueba:
```bash
npm run loadProducts
```

5. Iniciar:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints API

### Productos
```
GET /api/products     # Listar productos (filtros: category, price, etc)
GET /api/products/:id # Obtener producto
POST /api/products    # Crear producto (admin)
PUT /api/products/:id # Actualizar producto (admin)
DELETE /api/products/:id # Eliminar producto (admin)
```

### Carritos
```
POST /api/carts                    # Crear carrito
GET /api/carts/current             # Obtener carrito del usuario actual (autenticado)
GET /api/carts/:id                 # Ver carrito
POST /api/carts/:cid/products/:pid # Agregar producto
PUT /api/carts/:cid/products/:pid  # Actualizar cantidad
DELETE /api/carts/:cid/products/:pid # Eliminar producto
DELETE /api/carts/:id              # Vaciar carrito
POST /api/carts/:id/checkout       # Finalizar compra
```

### Autenticación
```
POST /api/sessions/register        # Registrar usuario
POST /api/sessions/login           # Iniciar sesión
GET /api/sessions/current          # Obtener usuario actual (autenticado)
POST /api/sessions/logout          # Cerrar sesión (autenticado)
```

### Vistas
```
GET /          # Home
GET /products/:id # Detalle producto
GET /cart      # Carrito
GET /admin     # Panel admin (admin)
GET /login     # Iniciar sesión
GET /register  # Registrarse
GET /profile   # Perfil de usuario (autenticado)
```

## Estructura
```
src/
├── config/      # Configuración DB y Passport
├── controllers/ # Lógica de negocio
├── models/      # Modelos MongoDB
├── routes/      # Rutas API
├── utils/       # Utilidades (JWT, etc)
├── views/       # Vistas Handlebars
└── app.js       # Entrada aplicación

public/
├── css/
├── js/
└── img/
```
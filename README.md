# MultiShop E-commerce

## Descripción
E-commerce desarrollado con Node.js, Express y MongoDB. Implementa una arquitectura en capas con patrones DAO, DTO y Repository, gestión avanzada de productos, sistema de tickets y panel de administración completo.

## Características
- Arquitectura en capas (DAO, DTO, Repository)
- Catálogo de productos con filtros y paginación
- Sistema de carritos en tiempo real
- Sistema de tickets para compras
- Panel de administración completo
- Gestión de usuarios y roles
- Sistema de ofertas (10% descuento)
- Diseño responsive (Bootstrap 5)
- Autenticación JWT y manejo de sesiones
- Roles de usuario (admin/user)
- Protección de rutas por rol
- Actualizaciones en tiempo real (Socket.IO)

## Tecnologías
- Node.js >=14.0.0
- Express 4.21.2
- MongoDB + Mongoose 8.1.0
- Socket.IO 4.7.4
- Express-Handlebars 7.1.2
- Bootstrap 5.3.0
- Passport.js + JWT
- Bcrypt para encriptación

## Arquitectura

### Capa de Persistencia (DAO)
- Implementación de BaseDAO para operaciones CRUD genéricas
- DAOs específicos para:
  - Productos
  - Carritos
  - Usuarios
  - Tickets

### Capa de Transferencia (DTO)
- DTOs para:
  - Productos (filtrado de información sensible)
  - Carritos (cálculos de totales)
  - Usuarios (seguridad de datos)
  - Tickets (formateo de información de compra)

### Capa de Repositorio
- Repositories para:
  - Productos (gestión de inventario)
  - Carritos (lógica de compra)
  - Usuarios (gestión de perfiles)
  - Tickets (procesamiento de compras)

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
ADMIN_SECRET_CODE=ADMIN123
```

4. Cargar datos iniciales:
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
GET /api/carts/current             # Obtener carrito actual
GET /api/carts/:id                 # Ver carrito
POST /api/carts/:cid/products/:pid # Agregar producto
PUT /api/carts/:cid/products/:pid  # Actualizar cantidad
DELETE /api/carts/:cid/products/:pid # Eliminar producto
DELETE /api/carts/:id              # Vaciar carrito
POST /api/carts/current/purchase   # Finalizar compra
```

### Tickets
```
GET /api/tickets          # Listar tickets (admin)
GET /api/tickets/:id      # Ver ticket
GET /api/tickets/user     # Tickets del usuario actual
POST /api/tickets         # Crear ticket (automático en compra)
PUT /api/tickets/:id      # Actualizar estado (admin)
```

### Autenticación
```
POST /api/sessions/register # Registrar usuario
POST /api/sessions/login    # Iniciar sesión
GET /api/sessions/current   # Usuario actual
POST /api/sessions/logout   # Cerrar sesión
```

### Vistas
```
GET /                    # Home
GET /products/:id        # Detalle producto
GET /cart               # Carrito
GET /admin              # Panel admin
GET /cart-management    # Gestión de carritos (admin)
GET /ticket-management  # Gestión de tickets (admin)
GET /user-management    # Gestión de usuarios (admin)
GET /login              # Iniciar sesión
GET /register           # Registrarse
GET /profile            # Perfil usuario
```

## Estructura
```
src/
├── config/         # Configuración (DB, Passport)
├── controllers/    # Controladores
├── models/         # Modelos Mongoose
├── dao/           # Data Access Objects
│   └── mongo/     # Implementaciones MongoDB
├── dto/           # Data Transfer Objects
├── repositories/  # Repositories
├── services/      # Servicios de negocio
├── middleware/    # Middlewares
├── routes/        # Rutas API
├── utils/         # Utilidades
├── views/         # Vistas Handlebars
└── app.js         # Entrada aplicación

public/
├── css/
├── js/
└── img/
```

## Seguridad
- Autenticación JWT
- Encriptación de contraseñas (bcrypt)
- Protección de rutas por rol
- Validación de datos
- Manejo de sesiones
- Sanitización de entradas

## Características Avanzadas
- Actualización en tiempo real de productos
- Sistema de tickets para compras
- Gestión de stock automática
- Cálculo automático de totales
- Historial de compras
- Panel administrativo completo
- Filtros avanzados de productos
- Paginación servidor/cliente
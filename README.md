# MultiShop E-commerce

![MultiShop](https://your-image-url.com/logo.png)

## 📌 Descripción
MultiShop es una plataforma de comercio electrónico desarrollada con **Node.js**, **Express** y **MongoDB**. Proporciona una experiencia de compra en tiempo real con un completo sistema de gestión de productos, carrito y un panel de administración intuitivo.

## 🚀 Características
✅ Catálogo de productos con filtros y paginación  
✅ Carrito de compras en tiempo real  
✅ Panel de administración  
✅ Sistema de ofertas (10% descuento en productos seleccionados)  
✅ Diseño responsive con **Bootstrap 5**  

---

## 🛠️ Tecnologías utilizadas
- **Node.js** >=14.0.0
- **Express** 4.21.2
- **MongoDB + Mongoose** 8.1.0
- **Socket.IO** 4.7.4
- **Express-Handlebars** 7.1.2
- **Bootstrap** 5.3.0

---

## 🔧 Instalación
Sigue estos pasos para configurar el proyecto en tu máquina local:

1️⃣ **Clonar el repositorio:**
```bash
git clone https://github.com/bautistabozzer/ProyectoBackend01.git
cd ProyectoBackend01
```

2️⃣ **Instalar dependencias:**
```bash
npm install
```

3️⃣ **Configurar las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
MONGODB_URI=mongodb://localhost:27017/multishop
PORT=8080
SESSION_SECRET=tu_secreto_aqui
```

4️⃣ **Cargar productos de prueba:**
```bash
npm run loadProducts
```

5️⃣ **Iniciar la aplicación:**
```bash
# Modo Desarrollo
npm run dev

# Modo Producción
npm start
```

---

## 📡 API Endpoints
### 📦 Productos
```http
GET    /api/products           # Listar productos (con filtros)
GET    /api/products/:id       # Obtener detalles de un producto
POST   /api/products           # Crear un nuevo producto
PUT    /api/products/:id       # Actualizar un producto
DELETE /api/products/:id       # Eliminar un producto
```

### 🛒 Carrito
```http
POST   /api/carts                        # Crear un nuevo carrito
GET    /api/carts/:id                    # Obtener detalles del carrito
POST   /api/carts/:cid/products/:pid      # Agregar un producto al carrito
PUT    /api/carts/:cid/products/:pid      # Modificar cantidad de un producto
DELETE /api/carts/:cid/products/:pid      # Eliminar un producto del carrito
DELETE /api/carts/:id                     # Vaciar el carrito
POST   /api/carts/:id/checkout            # Finalizar compra
```

### 🖥️ Vistas
```http
GET /           # Página de inicio
GET /products/:id  # Vista de detalle de un producto
GET /cart       # Vista del carrito de compras
GET /admin      # Panel de administración
```

---

## 📂 Estructura del Proyecto
```plaintext
src/
├── config/      # Configuración de la base de datos
├── controllers/ # Lógica de negocio
├── models/      # Modelos de MongoDB
├── routes/      # Rutas de la API
├── views/       # Plantillas de Handlebars
└── app.js       # Archivo principal de la aplicación

public/
├── css/         # Estilos
├── js/          # Scripts frontend
└── img/         # Imágenes y recursos
```

---

## ✨ Contribución
Si deseas contribuir al desarrollo de **MultiShop**, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y confirma (`git commit -m 'Añadida nueva funcionalidad'`).
4. Sube los cambios (`git push origin feature-nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📝 Licencia
Este proyecto está bajo la licencia **MIT**. Puedes ver más detalles en el archivo `LICENSE`.

📌 **Desarrollado por:** [Bautista Bozzer](https://github.com/bautistabozzer) 🚀


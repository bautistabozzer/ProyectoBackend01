const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');

const app = express();
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Montar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de ProyectoServerBase' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
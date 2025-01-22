const express = require('express');
const router = express.Router();
const UserManager = require('../fileManager/UserManager');
const cartManager = new UserManager('carts.json');
const productManager = new UserManager('products.json');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const carritos = await cartManager.readFile();
    const nuevoCarrito = {
      id: carritos.length > 0 ? Math.max(...carritos.map(c => c.id)) + 1 : 1,
      productos: []
    };
    
    carritos.push(nuevoCarrito);
    await cartManager.writeFile(carritos);
    
    res.status(201).json({ 
      status: 'success', 
      data: nuevoCarrito,
      mensaje: 'Carrito creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al crear el carrito',
      error: error.message 
    });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    
    // Verificar que el producto existe
    const productos = await productManager.readFile();
    const producto = productos.find(p => p.id === productId);
    
    if (!producto) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Producto no encontrado' 
      });
    }
    
    // Obtener y verificar el carrito
    const carritos = await cartManager.readFile();
    const carrito = carritos.find(c => c.id === cartId);
    
    if (!carrito) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Carrito no encontrado' 
      });
    }
    
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.productos.find(p => p.productId === productId);
    
    if (productoEnCarrito) {
      // Si el producto ya existe, incrementar la cantidad
      productoEnCarrito.quantity += 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      carrito.productos.push({
        productId,
        quantity: 1
      });
    }
    
    await cartManager.writeFile(carritos);
    
    res.json({ 
      status: 'success', 
      data: carrito,
      mensaje: 'Producto agregado al carrito exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al agregar producto al carrito',
      error: error.message 
    });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const carritos = await cartManager.readFile();
    const carrito = carritos.find(c => c.id === cartId);
    
    if (!carrito) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Carrito no encontrado' 
      });
    }
    
    res.json({ status: 'success', data: carrito });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al obtener el carrito',
      error: error.message 
    });
  }
});

module.exports = router;
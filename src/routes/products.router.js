import { Router } from 'express';
import UserManager from '../fileManager/UserManager.js';

const router = Router();
const productManager = new UserManager('products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await productManager.readFile();
    res.json({ status: 'success', data: productos });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al obtener los productos',
      error: error.message 
    });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await productManager.readFile();
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Producto no encontrado' 
      });
    }
    
    res.json({ status: 'success', data: producto });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al obtener el producto',
      error: error.message 
    });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, price, code, stock } = req.body;
    
    if (!title || !description || !price || !code || stock === undefined) {
      return res.status(400).json({ 
        status: 'error', 
        mensaje: 'Todos los campos son requeridos' 
      });
    }
    
    const productos = await productManager.readFile();
    const nuevoProducto = {
      id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
      title,
      description,
      price,
      code,
      stock
    };
    
    productos.push(nuevoProducto);
    await productManager.writeFile(productos);
    
    // Actualizar la lista global de productos
    global.products = productos;
    
    res.status(201).json({ 
      status: 'success', 
      data: nuevoProducto,
      mensaje: 'Producto creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al crear el producto',
      error: error.message 
    });
  }
});

// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await productManager.readFile();
    const indice = productos.findIndex(p => p.id === id);
    
    if (indice === -1) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Producto no encontrado' 
      });
    }
    
    const productoActualizado = {
      ...productos[indice],
      ...req.body,
      id // Mantener el ID original
    };
    
    productos[indice] = productoActualizado;
    await productManager.writeFile(productos);
    
    // Actualizar la lista global de productos
    global.products = productos;
    
    res.json({ 
      status: 'success', 
      data: productoActualizado,
      mensaje: 'Producto actualizado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al actualizar el producto',
      error: error.message 
    });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await productManager.readFile();
    const indice = productos.findIndex(p => p.id === id);
    
    if (indice === -1) {
      return res.status(404).json({ 
        status: 'error', 
        mensaje: 'Producto no encontrado' 
      });
    }
    
    productos.splice(indice, 1);
    await productManager.writeFile(productos);
    
    // Actualizar la lista global de productos
    global.products = productos;
    
    res.json({ 
      status: 'success', 
      mensaje: 'Producto eliminado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al eliminar el producto',
      error: error.message 
    });
  }
});

export default router;
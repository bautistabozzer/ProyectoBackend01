import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

// Obtener todos los productos con filtros y paginación
router.get('/', ProductController.getProducts);

// Obtener un producto por ID
router.get('/:pid', ProductController.getProductById);

// Crear un nuevo producto
router.post('/', ProductController.createProduct);

// Actualizar un producto
router.put('/:pid', ProductController.updateProduct);

// Eliminar un producto
router.delete('/:pid', ProductController.deleteProduct);

export default router; 
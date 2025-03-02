import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticateJWT, isAdmin } from '../config/passport.config.js';

const router = Router();

// Obtener todos los productos con filtros y paginación
router.get('/', ProductController.getProducts);

// Obtener un producto por ID
router.get('/:pid', ProductController.getProductById);

// Crear un nuevo producto (solo admin)
router.post('/', authenticateJWT, isAdmin, ProductController.createProduct);

// Actualizar un producto (solo admin)
router.put('/:pid', authenticateJWT, isAdmin, ProductController.updateProduct);

// Eliminar un producto (solo admin)
router.delete('/:pid', authenticateJWT, isAdmin, ProductController.deleteProduct);

export default router; 
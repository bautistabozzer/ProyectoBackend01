import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticateJWT, isUser } from '../config/passport.config.js';

const router = Router();

// Rutas para el carrito actual del usuario (protegidas)
// Estas rutas deben ir primero para que no sean capturadas por las rutas con parámetros

// Obtener carrito actual del usuario
router.get('/current', authenticateJWT, CartController.getCurrentCart);

// Añadir producto al carrito actual
router.post('/current/products/:pid', authenticateJWT, CartController.addProductToCart);

// Actualizar cantidad de producto en el carrito actual
router.put('/current/products/:pid', authenticateJWT, CartController.updateProductQuantity);

// Eliminar producto del carrito actual
router.delete('/current/products/:pid', authenticateJWT, CartController.removeProductFromCart);

// Vaciar carrito actual
router.delete('/current', authenticateJWT, CartController.clearCart);

// Finalizar compra del carrito actual
router.post('/current/checkout', authenticateJWT, CartController.checkoutCart);

// Rutas para carritos específicos (por ID)

// Crear un nuevo carrito
router.post('/', CartController.createCart);

// Obtener un carrito por ID
router.get('/:cid', CartController.getCart);

// Agregar producto a un carrito específico
router.post('/:cid/products/:pid', CartController.addProductToCart);

// Actualizar cantidad de un producto en un carrito específico
router.put('/:cid/products/:pid', CartController.updateProductQuantity);

// Eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);

// Vaciar un carrito específico
router.delete('/:cid', CartController.clearCart);

// Finalizar compra de un carrito específico
router.post('/:cid/checkout', CartController.checkoutCart);

export default router; 
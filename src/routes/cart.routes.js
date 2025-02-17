import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';

const router = Router();

// Crear un nuevo carrito
router.post('/', CartController.createCart);

// Obtener un carrito por ID
router.get('/:cid', CartController.getCart);

// Agregar producto al carrito
router.post('/:cid/products/:pid', CartController.addProductToCart);

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', CartController.updateProductQuantity);

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);

// Vaciar el carrito
router.delete('/:cid', CartController.clearCart);

// Finalizar compra
router.post('/:cid/checkout', CartController.checkoutCart);

export default router; 
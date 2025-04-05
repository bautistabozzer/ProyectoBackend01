import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticateJWT } from '../config/passport.config.js';
import { isUser, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas protegidas para usuarios
router.use(authenticateJWT);

// Rutas del carrito actual (solo usuarios)
router.get('/current', isUser, CartController.getCurrentCart);
router.post('/current/products/:pid', isUser, CartController.addProductToCart);
router.put('/current/products/:pid', isUser, CartController.updateProductQuantity);
router.delete('/current/products/:pid', isUser, CartController.removeProductFromCart);
router.delete('/current', isUser, CartController.clearCart);
router.post('/current/purchase', isUser, CartController.purchaseCart);

// Rutas administrativas (solo admin)
router.get('/', isAdmin, CartController.getAllCarts);
router.post('/', isAdmin, CartController.createCart);
router.get('/:cid', isAdmin, CartController.getCart);
router.delete('/:cid', isAdmin, CartController.clearCart);

export default router; 
import { Router } from 'express';
import { ViewController } from '../controllers/view.controller.js';

const router = Router();

// Página principal
router.get('/', ViewController.renderHome);

// Detalle de producto
router.get('/products/:pid', ViewController.renderProduct);

// Carrito
router.get('/cart', ViewController.renderCart);

// Panel de administración
router.get('/admin', ViewController.renderAdmin);

export default router; 
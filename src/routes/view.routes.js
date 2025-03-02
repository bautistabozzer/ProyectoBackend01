import { Router } from 'express';
import { ViewController } from '../controllers/view.controller.js';
import { authenticateJWT, isAdmin } from '../config/passport.config.js';

const router = Router();

// Middleware para verificar si hay un token en la URL
const checkTokenInQuery = (req, res, next) => {
    if (req.query.token) {
        console.log('Token encontrado en query params:', req.query.token.substring(0, 20) + '...');
        req.headers.authorization = `Bearer ${req.query.token}`;
    }
    next();
};

// Aplicar middleware a todas las rutas
router.use(checkTokenInQuery);

// Página principal
router.get('/', ViewController.renderHome);

// Detalle de producto
router.get('/products/:pid', ViewController.renderProduct);

// Carrito
router.get('/cart', ViewController.renderCart);

// Panel de administración (solo admin)
router.get('/admin', authenticateJWT, isAdmin, ViewController.renderAdmin);

// Rutas protegidas para administradores
router.get('/users', authenticateJWT, isAdmin, ViewController.renderUserManagement);

// Autenticación
router.get('/login', ViewController.renderLogin);
router.get('/register', ViewController.renderRegister);
router.get('/profile', authenticateJWT, ViewController.renderProfile);

export default router; 
import { Router } from 'express';
import { ViewController } from '../controllers/view.controller.js';
import { authenticateJWT, isAdmin } from '../config/passport.config.js';

const router = Router();

// Middleware para verificar si hay un token en la URL o en las cookies
const checkTokenInQuery = (req, res, next) => {
    // Verificar token en query params
    if (req.query.token) {
        console.log('Token encontrado en query params:', req.query.token.substring(0, 20) + '...');
        req.headers.authorization = `Bearer ${req.query.token}`;
    }
    // Verificar token en cookies
    else if (req.cookies && req.cookies.token) {
        console.log('Token encontrado en cookies');
        req.headers.authorization = `Bearer ${req.cookies.token}`;
    }
    next();
};

// Middleware para asegurar que el token de localStorage se guarde como cookie
const ensureTokenCookie = (req, res, next) => {
    if (!req.cookies.token && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }
    next();
};

// Aplicar middlewares a todas las rutas
router.use(checkTokenInQuery);
router.use(ensureTokenCookie);

// Página principal
router.get('/', ViewController.renderHome);

// Detalle de producto
router.get('/products/:pid', ViewController.renderProduct);

// Carrito
router.get('/cart', authenticateJWT, ViewController.renderCart);

// Panel de administración (solo admin)
router.get('/admin', authenticateJWT, isAdmin, ViewController.renderAdmin);

// Rutas protegidas para administradores
router.get('/cart-management', authenticateJWT, isAdmin, ViewController.renderCartManagement);
router.get('/users', authenticateJWT, isAdmin, ViewController.renderUserManagement);

// Autenticación
router.get('/login', ViewController.renderLogin);
router.get('/register', ViewController.renderRegister);
router.get('/profile', authenticateJWT, ViewController.renderProfile);

export default router; 
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../config/passport.config.js';

const router = Router();

// Registro de usuario
router.post('/register', AuthController.register);

// Login de usuario
router.post('/login', AuthController.login);

// Obtener usuario actual (protegido con JWT)
router.get('/current', authenticateJWT, AuthController.getCurrentUser);

// Cerrar sesión
router.post('/logout', authenticateJWT, AuthController.logout);

// Obtener historial de compras
router.get('/purchase-history', authenticateJWT, AuthController.getPurchaseHistory);

export default router; 
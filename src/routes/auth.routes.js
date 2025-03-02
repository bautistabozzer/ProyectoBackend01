import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT, isAdmin } from '../config/passport.config.js';

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

// Historial de compras de un usuario específico (solo admin)
router.get('/purchase-history/:userId', authenticateJWT, isAdmin, AuthController.getUserPurchaseHistory);

// Cambiar rol de usuario (solo admin)
router.put('/users/:userId/role', authenticateJWT, isAdmin, AuthController.changeUserRole);

export default router; 
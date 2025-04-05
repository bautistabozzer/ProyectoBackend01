import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller.js';
import { authenticateJWT, isAdmin } from '../config/passport.config.js';

const router = Router();

// Rutas protegidas para administradores
router.get('/', authenticateJWT, isAdmin, TicketController.getAllTickets);
router.get('/:tid', authenticateJWT, isAdmin, TicketController.getTicketById);

export default router; 
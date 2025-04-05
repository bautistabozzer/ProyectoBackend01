import { TicketDTO } from '../dto/ticket.dto.js';
import { TicketDAO } from '../dao/ticket.dao.js';

/**
 * Repository para la gestión de tickets de compra
 * Implementa el patrón Repository para separar la lógica de negocio del acceso a datos
 */
export class TicketRepository {
    constructor() {
        this.dao = new TicketDAO();
    }

    /**
     * Crea un nuevo ticket de compra
     * @param {Object} ticketData - Datos del ticket a crear
     * @param {string} ticketData.purchaser - Email del comprador
     * @param {Array} ticketData.products - Productos incluidos en el ticket
     * @param {number} ticketData.amount - Monto total de la compra
     * @returns {Promise<TicketDTO>} Ticket creado
     * @throws {Error} Si hay un error en la creación
     */
    async createTicket(ticketData) {
        try {
            const ticket = await this.dao.createTicket(ticketData);
            return TicketDTO.fromModel(ticket);
        } catch (error) {
            console.error('Error en createTicket Repository:', error);
            throw error;
        }
    }

    /**
     * Obtiene un ticket por su ID
     * @param {string} id - ID del ticket
     * @returns {Promise<TicketDTO|null>} Ticket encontrado o null
     * @throws {Error} Si hay un error en la búsqueda
     */
    async getTicketById(id) {
        try {
            const ticket = await this.dao.getTicketById(id);
            return TicketDTO.fromModel(ticket);
        } catch (error) {
            console.error('Error en getTicketById Repository:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los tickets de un usuario
     * @param {string} userId - ID o email del usuario
     * @returns {Promise<Array<TicketDTO>>} Lista de tickets del usuario
     * @throws {Error} Si hay un error en la búsqueda
     */
    async getTicketsByUser(userId) {
        try {
            const tickets = await this.dao.getTicketsByUser(userId);
            return TicketDTO.fromModelArray(tickets);
        } catch (error) {
            console.error('Error en getTicketsByUser Repository:', error);
            throw error;
        }
    }

    /**
     * Obtiene tickets dentro de un rango de fechas
     * @param {Date} startDate - Fecha inicial
     * @param {Date} endDate - Fecha final
     * @returns {Promise<Array<TicketDTO>>} Lista de tickets en el rango
     * @throws {Error} Si hay un error en la búsqueda
     */
    async getTicketsByDateRange(startDate, endDate) {
        try {
            const tickets = await this.dao.getTicketsByDateRange(startDate, endDate);
            return TicketDTO.fromModelArray(tickets);
        } catch (error) {
            console.error('Error en getTicketsByDateRange Repository:', error);
            throw error;
        }
    }

    /**
     * Actualiza el estado de un ticket
     * @param {string} ticketId - ID del ticket
     * @param {string} status - Nuevo estado ('pending'|'completed'|'failed')
     * @returns {Promise<TicketDTO>} Ticket actualizado
     * @throws {Error} Si hay un error en la actualización
     */
    async updateTicketStatus(ticketId, status) {
        try {
            const ticket = await this.dao.updateTicketStatus(ticketId, status);
            return TicketDTO.fromModel(ticket);
        } catch (error) {
            console.error('Error en updateTicketStatus Repository:', error);
            throw error;
        }
    }

    /**
     * Elimina un ticket
     * @param {string} id - ID del ticket a eliminar
     * @returns {Promise<boolean>} true si se eliminó correctamente
     * @throws {Error} Si hay un error en la eliminación
     */
    async deleteTicket(id) {
        try {
            return await this.dao.deleteTicket(id);
        } catch (error) {
            console.error('Error en deleteTicket Repository:', error);
            throw error;
        }
    }
} 
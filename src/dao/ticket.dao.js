import { BaseDAO } from './base.dao.js';
import { TicketModel } from '../models/ticket.model.js';

export class TicketDAO extends BaseDAO {
    constructor() {
        super(TicketModel);
    }

    async createTicket(ticketData) {
        try {
            const ticket = await this.create(ticketData);
            return await ticket.populate('products.product');
        } catch (error) {
            console.error('Error en createTicket DAO:', error);
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            return await this.model.findById(id).populate('products.product');
        } catch (error) {
            console.error('Error en getTicketById DAO:', error);
            throw error;
        }
    }

    async getTicketsByUser(userId) {
        try {
            return await this.model.find({ purchaser: userId })
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            console.error('Error en getTicketsByUser DAO:', error);
            throw error;
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            return await this.model.find({
                purchase_datetime: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('products.product')
              .sort({ purchase_datetime: -1 });
        } catch (error) {
            console.error('Error en getTicketsByDateRange DAO:', error);
            throw error;
        }
    }

    async updateTicketStatus(ticketId, status) {
        try {
            return await this.model.findByIdAndUpdate(
                ticketId,
                { status },
                { new: true }
            ).populate('products.product');
        } catch (error) {
            console.error('Error en updateTicketStatus DAO:', error);
            throw error;
        }
    }

    async deleteTicket(id) {
        try {
            return await this.delete(id);
        } catch (error) {
            console.error('Error en deleteTicket DAO:', error);
            throw error;
        }
    }
} 
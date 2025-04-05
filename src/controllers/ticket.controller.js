import { TicketModel } from '../models/ticket.model.js';

export class TicketController {
    static async getAllTickets(req, res) {
        try {
            const tickets = await TicketModel.find()
                .populate('products.product')
                .sort({ purchase_datetime: -1 })
                .lean();

            return res.status(200).json({
                status: 'success',
                payload: tickets
            });
        } catch (error) {
            console.error('Error al obtener tickets:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener los tickets'
            });
        }
    }

    static async getTicketById(req, res) {
        try {
            const { tid } = req.params;
            const ticket = await TicketModel.findById(tid)
                .populate('products.product')
                .lean();

            if (!ticket) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket no encontrado'
                });
            }

            return res.status(200).json({
                status: 'success',
                payload: ticket
            });
        } catch (error) {
            console.error('Error al obtener ticket:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener el ticket'
            });
        }
    }
} 
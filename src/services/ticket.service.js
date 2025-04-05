import { TicketModel } from '../models/ticket.model.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    generateUniqueCode() {
        return `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;
    }

    calculateTotal(products) {
        return products.reduce((total, item) => {
            const price = item.product.finalPrice || item.product.price;
            return total + (price * item.quantity);
        }, 0);
    }

    async validateProducts(products) {
        const validationResults = await Promise.all(
            products.map(async (item) => {
                try {
                    const product = await this.productRepository.getProductById(item.product._id);
                    if (!product) {
                        return {
                            success: false,
                            product: item.product._id,
                            reason: 'Producto no encontrado'
                        };
                    }
                    if (product.stock < item.quantity) {
                        return {
                            success: false,
                            product: item.product._id,
                            reason: 'Stock insuficiente',
                            available: product.stock
                        };
                    }
                    return {
                        success: true,
                        product: item.product._id,
                        quantity: item.quantity
                    };
                } catch (error) {
                    return {
                        success: false,
                        product: item.product._id,
                        reason: error.message
                    };
                }
            })
        );

        return {
            valid: validationResults.filter(result => result.success),
            invalid: validationResults.filter(result => !result.success)
        };
    }

    async createTicket(products, purchaserEmail) {
        try {
            // Validar productos
            const { valid, invalid } = await this.validateProducts(products);

            if (valid.length === 0) {
                throw new Error('No hay productos válidos para procesar');
            }

            // Procesar productos válidos
            const validProducts = products.filter(item => 
                valid.some(v => v.product.toString() === item.product._id.toString())
            );

            // Actualizar stock
            await Promise.all(
                valid.map(async (item) => {
                    await this.productRepository.updateStock(item.product, item.quantity);
                })
            );

            // Crear ticket
            const ticket = await TicketModel.create({
                code: this.generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: this.calculateTotal(validProducts),
                purchaser: purchaserEmail,
                products: validProducts.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.finalPrice || item.product.price
                }))
            });

            return {
                success: true,
                ticket,
                failedProducts: invalid.map(item => item.product)
            };
        } catch (error) {
            console.error('Error en createTicket:', error);
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            return await TicketModel.findById(ticketId)
                .populate('products.product');
        } catch (error) {
            console.error('Error en getTicketById:', error);
            throw new Error(`Error al obtener ticket: ${error.message}`);
        }
    }

    async getUserTickets(email) {
        try {
            return await TicketModel.find({ purchaser: email })
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            console.error('Error en getUserTickets:', error);
            throw new Error(`Error al obtener tickets del usuario: ${error.message}`);
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            return await TicketModel.find({
                purchase_datetime: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('products.product');
        } catch (error) {
            console.error('Error en getTicketsByDateRange:', error);
            throw new Error(`Error al obtener tickets por rango de fecha: ${error.message}`);
        }
    }
} 
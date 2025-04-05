import { TicketModel } from '../models/ticket.model.js';
import { ProductDao } from '../dao/product.dao.js';

export class TicketService {
    constructor() {
        this.productDao = new ProductDao();
    }

    async createTicket(cartProducts, userEmail) {
        try {
            let totalAmount = 0;
            const successfulProducts = [];
            const failedProducts = [];

            // Procesar cada producto
            for (const item of cartProducts) {
                try {
                    const product = await this.productDao.getById(item.product);
                    
                    if (product.stock >= item.quantity) {
                        // Actualizar stock
                        await this.productDao.updateStock(product._id, item.quantity);
                        
                        // Calcular subtotal
                        const price = product.onSale ? product.finalPrice : product.price;
                        const subtotal = price * item.quantity;
                        totalAmount += subtotal;

                        // Agregar a productos exitosos
                        successfulProducts.push({
                            product: product._id,
                            quantity: item.quantity,
                            price: price
                        });
                    } else {
                        failedProducts.push(item.product);
                    }
                } catch (error) {
                    console.error(`Error procesando producto ${item.product}:`, error);
                    failedProducts.push(item.product);
                }
            }

            // Si hay productos exitosos, crear ticket
            if (successfulProducts.length > 0) {
                const ticket = await TicketModel.create({
                    purchaser: userEmail,
                    amount: totalAmount,
                    products: successfulProducts
                });

                return {
                    ticket,
                    failedProducts
                };
            }

            return {
                ticket: null,
                failedProducts
            };
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    async getTicketsByUser(email) {
        try {
            return await TicketModel.find({ purchaser: email })
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error al obtener tickets: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            return await TicketModel.findById(ticketId)
                .populate('products.product');
        } catch (error) {
            throw new Error(`Error al obtener ticket: ${error.message}`);
        }
    }
} 
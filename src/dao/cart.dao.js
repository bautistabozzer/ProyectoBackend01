import { BaseDao } from './base.dao.js';
import { CartModel } from '../models/cart.model.js';

export class CartDao extends BaseDao {
    constructor() {
        super(CartModel);
    }

    async getActiveCartByUser(userId) {
        try {
            return await this.findOne({ user: userId, status: 'active' });
        } catch (error) {
            console.error('Error en CartDao.getActiveCartByUser:', error);
            throw error;
        }
    }

    async getCompletedCartsByUser(userId) {
        try {
            return await this.model.find({ 
                user: userId, 
                status: 'completed' 
            }).populate('products.product');
        } catch (error) {
            console.error('Error en CartDao.getCompletedCartsByUser:', error);
            throw error;
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await this.getById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            return await cart.save();
        } catch (error) {
            console.error('Error en CartDao.addProduct:', error);
            throw error;
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.getById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = cart.products.filter(
                item => item.product.toString() !== productId
            );

            return await cart.save();
        } catch (error) {
            console.error('Error en CartDao.removeProduct:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');

            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        } catch (error) {
            console.error('Error en CartDao.updateProductQuantity:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.getById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = [];
            return await cart.save();
        } catch (error) {
            console.error('Error en CartDao.clearCart:', error);
            throw error;
        }
    }

    async completeCart(cartId) {
        try {
            return await this.update(cartId, { 
                status: 'completed',
                completedAt: new Date()
            });
        } catch (error) {
            console.error('Error en CartDao.completeCart:', error);
            throw error;
        }
    }
} 
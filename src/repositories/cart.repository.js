import { CartDao } from '../dao/cart.dao.js';
import { CartDTO } from '../dto/cart.dto.js';
import { ProductRepository } from './product.repository.js';

export class CartRepository {
    constructor() {
        this.dao = new CartDao();
        this.productRepository = new ProductRepository();
    }

    async getAllCarts(options = {}) {
        const carts = await this.dao.getAll({}, options);
        return CartDTO.fromArray(carts);
    }

    async getCartById(id) {
        const cart = await this.dao.getById(id);
        return CartDTO.from(cart);
    }

    async getActiveCartByUser(userId) {
        const cart = await this.dao.getActiveCartByUser(userId);
        return CartDTO.from(cart);
    }

    async createCart(userId) {
        const cart = await this.dao.create({
            user: userId,
            products: [],
            status: 'active'
        });
        return CartDTO.from(cart);
    }

    async addProduct(cartId, productId, quantity) {
        // Verificar stock antes de agregar
        const product = await this.productRepository.getProductById(productId);
        if (!product) throw new Error('Producto no encontrado');
        if (product.stock < quantity) throw new Error('Stock insuficiente');

        const cart = await this.dao.addProduct(cartId, productId, quantity);
        return CartDTO.from(cart);
    }

    async removeProduct(cartId, productId) {
        const cart = await this.dao.removeProduct(cartId, productId);
        return CartDTO.from(cart);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        // Verificar stock antes de actualizar
        const product = await this.productRepository.getProductById(productId);
        if (!product) throw new Error('Producto no encontrado');
        if (product.stock < quantity) throw new Error('Stock insuficiente');

        const cart = await this.dao.updateProductQuantity(cartId, productId, quantity);
        return CartDTO.from(cart);
    }

    async clearCart(cartId) {
        const cart = await this.dao.clearCart(cartId);
        return CartDTO.from(cart);
    }

    async completeCart(cartId) {
        const cart = await this.dao.completeCart(cartId);
        return CartDTO.from(cart);
    }

    async getCompletedCartsByUser(userId) {
        const carts = await this.dao.getCompletedCartsByUser(userId);
        return CartDTO.fromArray(carts);
    }

    async processCartPurchase(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const failedProducts = [];
        const successfulProducts = [];

        // Procesar cada producto
        for (const item of cart.products) {
            try {
                await this.productRepository.updateStock(item.product.id, item.quantity);
                successfulProducts.push(item);
            } catch (error) {
                failedProducts.push({
                    product: item.product,
                    quantity: item.quantity,
                    reason: error.message
                });
            }
        }

        // Actualizar el carrito
        if (failedProducts.length === 0) {
            // Si todo fue exitoso, completar el carrito
            await this.completeCart(cartId);
        } else {
            // Si hubo fallos, actualizar el carrito solo con los productos fallidos
            const updatedCart = await this.dao.update(cartId, {
                products: failedProducts.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity
                }))
            });
            return {
                success: false,
                cart: CartDTO.from(updatedCart),
                failedProducts,
                successfulProducts
            };
        }

        return {
            success: true,
            cart: cart,
            failedProducts,
            successfulProducts
        };
    }
} 
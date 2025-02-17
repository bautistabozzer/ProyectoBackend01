import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

export class CartController {
    // Crear un nuevo carrito
    static async createCart(req, res) {
        try {
            const newCart = await CartModel.create({ products: [] });
            res.status(201).json({
                status: 'success',
                payload: newCart
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Obtener un carrito por ID
    static async getCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            const total = await cart.calculateTotal();
            const subtotal = await cart.calculateSubTotal();
            const savings = await cart.calculateSavings();

            res.json({
                status: 'success',
                payload: {
                    cart,
                    total,
                    subtotal,
                    savings
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Agregar producto al carrito
    static async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;

            // Verificar que el producto existe y tiene stock suficiente
            const product = await ProductModel.findById(pid);
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Stock insuficiente'
                });
            }

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Buscar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex === -1) {
                cart.products.push({ product: pid, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();

            // Actualizar el stock del producto
            product.stock -= quantity;
            await product.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);
            req.app.get('io').emit('productUpdated', product);

            res.json({
                status: 'success',
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Actualizar cantidad de un producto en el carrito
    static async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La cantidad debe ser mayor a 0'
                });
            }

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            const productItem = cart.products.find(
                item => item.product.toString() === pid
            );

            if (!productItem) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado en el carrito'
                });
            }

            const product = await ProductModel.findById(pid);
            const quantityDiff = quantity - productItem.quantity;

            if (quantityDiff > 0 && product.stock < quantityDiff) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Stock insuficiente'
                });
            }

            productItem.quantity = quantity;
            product.stock -= quantityDiff;

            await Promise.all([cart.save(), product.save()]);

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);
            req.app.get('io').emit('productUpdated', product);

            res.json({
                status: 'success',
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Eliminar un producto del carrito
    static async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            const productItem = cart.products.find(
                item => item.product.toString() === pid
            );

            if (!productItem) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado en el carrito'
                });
            }

            // Restaurar el stock del producto
            const product = await ProductModel.findById(pid);
            product.stock += productItem.quantity;
            await product.save();

            // Eliminar el producto del carrito
            cart.products = cart.products.filter(
                item => item.product.toString() !== pid
            );
            await cart.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);
            req.app.get('io').emit('productUpdated', product);

            res.json({
                status: 'success',
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Vaciar el carrito
    static async clearCart(req, res) {
        try {
            const { cid } = req.params;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Restaurar el stock de todos los productos
            await Promise.all(cart.products.map(async (item) => {
                const product = await ProductModel.findById(item.product);
                product.stock += item.quantity;
                return product.save();
            }));

            cart.products = [];
            await cart.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);

            res.json({
                status: 'success',
                message: 'Carrito vaciado exitosamente'
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Finalizar compra
    static async checkoutCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Verificar stock y actualizar productos
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.product);
                
                if (!product) {
                    return res.status(404).json({
                        status: 'error',
                        message: `Producto ${item.product} no encontrado`
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Stock insuficiente para ${product.title}`
                    });
                }

                // Actualizar stock
                product.stock -= item.quantity;
                await product.save();
            }

            // Marcar el carrito como completado
            cart.status = 'completed';
            cart.completedAt = new Date();
            await cart.save();

            // Crear un nuevo carrito vacío para el usuario
            const newCart = await CartModel.create({ products: [] });
            req.session.cartId = newCart._id;

            // Emitir eventos de Socket.IO
            req.app.get('io').emit('cartCompleted', cart);
            cart.products.forEach(item => {
                req.app.get('io').emit('productUpdated', item.product);
            });

            res.json({
                status: 'success',
                message: 'Compra realizada exitosamente',
                newCartId: newCart._id
            });
        } catch (error) {
            console.error('Error en checkoutCart:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al procesar la compra'
            });
        }
    }
} 
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { TicketService } from '../services/ticket.service.js';

export class CartController {
    static ticketService = new TicketService();

    // Obtener todos los carritos (admin)
    static async getAllCarts(req, res) {
        try {
            const carts = await CartModel.find()
                .populate('user', 'email firstName lastName')
                .populate('products.product');
            
            return res.status(200).json({
                status: 'success',
                payload: {
                    carts
                }
            });
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener los carritos'
            });
        }
    }

    // Crear un nuevo carrito
    static async createCart(req, res) {
        try {
            const userId = req.user?._id || null;
            
            const cart = await CartModel.create({
                user: userId,
                products: []
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Carrito creado exitosamente',
                payload: {
                    cart
                }
            });
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear el carrito'
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

            // Calcular totales
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

    // Obtener carrito actual del usuario
    static async getCurrentCart(req, res) {
        try {
            // Verificar si el usuario está autenticado
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }
            
            const userId = req.user._id;
            
            // Buscar carrito activo del usuario
            let cart = await CartModel.findOne({ 
                user: userId, 
                status: 'active' 
            }).populate('products.product');
            
            // Si no existe, crear uno nuevo
            if (!cart) {
                cart = await CartModel.create({
                    user: userId,
                    products: []
                });
            }
            
            return res.status(200).json({
                status: 'success',
                payload: {
                    cart
                }
            });
        } catch (error) {
            console.error('Error al obtener carrito actual:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener el carrito actual'
            });
        }
    }

    // Agregar producto al carrito
    static async addProductToCart(req, res) {
        try {
            // Obtener parámetros
            const { pid } = req.params;
            const { quantity = 1 } = req.body;
            
            // Si es una ruta con /current/, obtener el ID del usuario del token
            let cartId;
            if (req.path.includes('/current/')) {
                // Verificar si el usuario está autenticado
                if (!req.user || !req.user._id) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Usuario no autenticado'
                    });
                }
                
                // Obtener el carrito activo del usuario
                const userId = req.user._id;
                let cart = await CartModel.findOne({ user: userId, status: 'active' });
                
                // Si no existe, crear uno nuevo
                if (!cart) {
                    cart = await CartModel.create({
                        user: userId,
                        products: []
                    });
                }
                
                cartId = cart._id;
            } else {
                // Ruta tradicional con ID de carrito
                cartId = req.params.cid;
            }

            // Validar cantidad
            if (quantity <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La cantidad debe ser mayor a 0'
                });
            }

            // Buscar producto
            const product = await ProductModel.findById(pid);
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }

            // Verificar stock
            if (product.stock < quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Stock insuficiente'
                });
            }

            // Buscar carrito
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Verificar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex !== -1) {
                // Actualizar cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Agregar producto
                cart.products.push({
                    product: pid,
                    quantity
                });
            }

            await cart.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);

            res.json({
                status: 'success',
                message: 'Producto agregado al carrito',
                payload: cart
            });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Actualizar cantidad de un producto en el carrito
    static async updateProductQuantity(req, res) {
        try {
            // Obtener parámetros
            const { pid } = req.params;
            const { quantity, change } = req.body;
            
            // Si es una ruta con /current/, obtener el ID del usuario del token
            let cartId;
            if (req.path.includes('/current/')) {
                // Verificar si el usuario está autenticado
                if (!req.user || !req.user._id) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Usuario no autenticado'
                    });
                }
                
                // Obtener el carrito activo del usuario
                const userId = req.user._id;
                let cart = await CartModel.findOne({ user: userId, status: 'active' });
                
                // Si no existe, crear uno nuevo
                if (!cart) {
                    cart = await CartModel.create({
                        user: userId,
                        products: []
                    });
                }
                
                cartId = cart._id;
            } else {
                // Ruta tradicional con ID de carrito
                cartId = req.params.cid;
            }

            // Buscar carrito
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Buscar producto en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product._id.toString() === pid
            );

            if (productIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado en el carrito'
                });
            }

            // Obtener producto y cantidad actual
            const cartProduct = cart.products[productIndex];
            const product = cartProduct.product;
            let newQuantity;

            // Determinar nueva cantidad
            if (quantity !== undefined) {
                // Si se proporciona quantity, usar ese valor
                newQuantity = parseInt(quantity);
            } else if (change !== undefined) {
                // Si se proporciona change, sumar/restar a la cantidad actual
                newQuantity = cartProduct.quantity + parseInt(change);
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Debe proporcionar quantity o change'
                });
            }

            // Validar nueva cantidad
            if (newQuantity <= 0) {
                // Si la cantidad es 0 o negativa, eliminar el producto
                cart.products.splice(productIndex, 1);
            } else {
                // Verificar stock
                if (product.stock < newQuantity) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Stock insuficiente. Disponible: ${product.stock}`
                    });
                }

                // Actualizar cantidad
                cart.products[productIndex].quantity = newQuantity;
            }

            await cart.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);

            res.json({
                status: 'success',
                message: 'Cantidad actualizada',
                payload: cart
            });
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Eliminar un producto del carrito
    static async removeProductFromCart(req, res) {
        try {
            // Obtener parámetros
            const { pid } = req.params;
            
            // Si es una ruta con /current/, obtener el ID del usuario del token
            let cartId;
            if (req.path.includes('/current/')) {
                // Verificar si el usuario está autenticado
                if (!req.user || !req.user._id) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Usuario no autenticado'
                    });
                }
                
                // Obtener el carrito activo del usuario
                const userId = req.user._id;
                let cart = await CartModel.findOne({ user: userId, status: 'active' });
                
                // Si no existe, crear uno nuevo
                if (!cart) {
                    cart = await CartModel.create({
                        user: userId,
                        products: []
                    });
                }
                
                cartId = cart._id;
            } else {
                // Ruta tradicional con ID de carrito
                cartId = req.params.cid;
            }

            // Buscar carrito
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }

            // Buscar producto en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado en el carrito'
                });
            }

            // Eliminar producto
            cart.products.splice(productIndex, 1);
            await cart.save();

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('cartUpdated', cart);

            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito',
                payload: cart
            });
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Vaciar el carrito
    static async clearCart(req, res) {
        try {
            // Si es una ruta con /current, obtener el ID del usuario del token
            let cartId;
            if (req.path.includes('/current')) {
                // Verificar si el usuario está autenticado
                if (!req.user || !req.user._id) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Usuario no autenticado'
                    });
                }
                
                // Obtener el carrito activo del usuario
                const userId = req.user._id;
                let cart = await CartModel.findOne({ user: userId, status: 'active' });
                
                if (!cart) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Carrito no encontrado'
                    });
                }
                
                // Para usuarios normales, solo vaciar el carrito
                cart.products = [];
                await cart.save();
                
                // Emitir evento de Socket.IO para actualización en tiempo real
                req.app.get('io').emit('cartUpdated', cart);
                
                return res.json({
                    status: 'success',
                    message: 'Carrito vaciado',
                    payload: cart
                });
            } else {
                // Ruta para administradores: eliminar el carrito completamente
                cartId = req.params.cid;
                
                // Eliminar el carrito
                const result = await CartModel.findByIdAndDelete(cartId);
                
                if (!result) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Carrito no encontrado'
                    });
                }

                // Emitir evento de Socket.IO para actualización en tiempo real
                req.app.get('io').emit('cartDeleted', cartId);

                return res.json({
                    status: 'success',
                    message: 'Carrito eliminado',
                    payload: result
                });
            }
        } catch (error) {
            console.error('Error al procesar el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Finalizar compra
    static async checkoutCart(req, res) {
        try {
            // Verificar si el usuario está autenticado
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }
            
            const userId = req.user._id;
            const cart = await CartModel.findOne({ user: userId, status: 'active' }).populate('products.product');
            
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            if (cart.products.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El carrito está vacío'
                });
            }
            
            // Verificar stock de productos
            for (const item of cart.products) {
                const product = item.product;
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Stock insuficiente para ${product.title}. Disponible: ${product.stock}`
                    });
                }
            }
            
            // Actualizar stock de productos
            for (const item of cart.products) {
                const product = item.product;
                product.stock -= item.quantity;
                await product.save();
            }
            
            // Marcar carrito como completado
            cart.status = 'completed';
            cart.completedAt = new Date();
            cart.user = userId; // Asegurar que el carrito esté asociado al usuario
            await cart.save();
            
            // Crear un nuevo carrito activo para el usuario
            const newCart = await CartModel.create({
                user: userId,
                products: []
            });
            
            // Emitir evento de carrito actualizado
            req.app.get('io').emit('cartUpdated', { products: [] });
            
            return res.status(200).json({
                status: 'success',
                message: 'Compra realizada con éxito',
                payload: {
                    cart: cart
                }
            });
        } catch (error) {
            console.error('Error en checkout:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar la compra'
            });
        }
    }

    // Método para realizar la compra del carrito
    static async purchaseCart(req, res) {
        try {
            // Verificar usuario autenticado
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }

            // Obtener carrito activo del usuario
            const cart = await CartModel.findOne({
                user: req.user._id,
                status: 'active'
            }).populate('products.product');

            if (!cart || cart.products.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Carrito vacío o no encontrado'
                });
            }

            // Procesar la compra
            const result = await CartController.ticketService.createTicket(
                cart.products,
                req.user.email
            );

            // Si hay productos que no se pudieron comprar, actualizamos el carrito
            if (result.failedProducts.length > 0) {
                cart.products = cart.products.filter(item => 
                    result.failedProducts.includes(item.product._id.toString())
                );
                await cart.save();
            } else {
                // Si todos los productos se compraron, crear nuevo carrito vacío
                cart.status = 'completed';
                await cart.save();
                
                await CartModel.create({
                    user: req.user._id,
                    products: []
                });
            }

            // Responder con el resultado
            res.json({
                status: 'success',
                message: 'Compra procesada',
                payload: {
                    ticket: result.ticket,
                    failedProducts: result.failedProducts
                }
            });
        } catch (error) {
            console.error('Error en purchaseCart:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
} 
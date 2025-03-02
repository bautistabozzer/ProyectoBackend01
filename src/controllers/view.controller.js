import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';
import { UserModel } from '../models/user.model.js';

export class ViewController {
    // Vista principal con listado de productos
    static async renderHome(req, res) {
        try {
            const { 
                page = 1, 
                limit = 9, 
                sort, 
                category, 
                status,
                minPrice,
                maxPrice 
            } = req.query;

            const query = {};
            if (category) query.category = category;
            if (status !== undefined) query.status = status === 'true';
            if (minPrice !== undefined) query.price = { $gte: Number(minPrice) };
            if (maxPrice !== undefined) {
                query.price = { ...query.price, $lte: Number(maxPrice) };
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
            };

            const products = await ProductModel.paginate(query, options);
            const categories = await ProductModel.distinct('category');

            // Crear carrito si no existe en la sesión
            if (!req.session.cartId) {
                const cart = await CartModel.create({ products: [] });
                req.session.cartId = cart._id;
            }

            res.render('home', {
                title: 'Productos',
                products,
                categories,
                filters: { category, sort, status, minPrice, maxPrice },
                cartId: req.session.cartId
            });
        } catch (error) {
            console.error('Error en renderHome:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar la página principal' 
            });
        }
    }

    // Vista de detalle de producto
    static async renderProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductModel.findById(pid);
            
            if (!product) {
                return res.status(404).render('error', { 
                    message: 'Producto no encontrado' 
                });
            }

            // Crear carrito si no existe en la sesión
            if (!req.session.cartId) {
                const cart = await CartModel.create({ products: [] });
                req.session.cartId = cart._id;
            }

            res.render('product', {
                title: product.title,
                product,
                cartId: req.session.cartId
            });
        } catch (error) {
            console.error('Error en renderProduct:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el detalle del producto' 
            });
        }
    }

    // Vista del carrito
    static async renderCart(req, res) {
        try {
            // Crear carrito si no existe en la sesión
            if (!req.session.cartId) {
                const cart = await CartModel.create({ products: [] });
                req.session.cartId = cart._id;
            }

            const cart = await CartModel.findById(req.session.cartId);
            if (!cart) {
                const newCart = await CartModel.create({ products: [] });
                req.session.cartId = newCart._id;
                return res.render('cart', {
                    title: 'Mi Carrito',
                    cart: newCart,
                    total: 0,
                    subtotal: 0,
                    savings: 0
                });
            }

            const total = await cart.calculateTotal();
            const subtotal = await cart.calculateSubTotal();
            const savings = await cart.calculateSavings();

            res.render('cart', {
                title: 'Mi Carrito',
                cart,
                total,
                subtotal,
                savings
            });
        } catch (error) {
            console.error('Error en renderCart:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el carrito' 
            });
        }
    }

    // Vista del panel de administración
    static async renderAdmin(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { createdAt: -1 }
            };

            const products = await ProductModel.paginate({}, options);

            res.render('admin', {
                title: 'Panel de Administración',
                products
            });
        } catch (error) {
            console.error('Error en renderAdmin:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el panel de administración' 
            });
        }
    }

    // Vista de login
    static renderLogin(req, res) {
        res.render('login', {
            title: 'Iniciar Sesión'
        });
    }

    // Vista de registro
    static renderRegister(req, res) {
        res.render('register', {
            title: 'Crear Cuenta'
        });
    }

    // Vista de perfil
    static renderProfile(req, res) {
        res.render('profile', {
            title: 'Mi Perfil'
        });
    }

    static async renderUserManagement(req, res) {
        try {
            console.log('Iniciando renderUserManagement');
            console.log('Usuario autenticado:', req.user.email, 'Rol:', req.user.role);
            
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            console.log('Parámetros de paginación:', { page, limit });
            
            console.log('Consultando usuarios con paginación...');
            const users = await UserModel.paginate({}, { 
                page, 
                limit,
                lean: true,
                sort: { createdAt: -1 }
            });
            
            console.log('Usuarios obtenidos:', users.docs.length);
            console.log('Total de páginas:', users.totalPages);
            
            res.render('user-management', { 
                title: 'Gestión de Usuarios',
                users,
                page
            });
        } catch (error) {
            console.error('Error al renderizar la página de gestión de usuarios:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar la página de gestión de usuarios' 
            });
        }
    }
} 
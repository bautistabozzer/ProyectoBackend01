import { UserModel } from '../models/user.model.js';
import { CartModel } from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.utils.js';
import bcrypt from 'bcrypt';

export class AuthController {
    // Registro de usuario
    static async register(req, res) {
        try {
            const { firstName, lastName, email, password, adminCode } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El correo electrónico ya está registrado'
                });
            }

            // Crear un carrito para el usuario
            const cart = await CartModel.create({ products: [] });

            // Determinar el rol (admin si se proporciona el código correcto)
            const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'ADMIN123';
            const role = (adminCode && adminCode === adminSecretCode) ? 'admin' : 'user';

            // Crear el usuario
            const user = await UserModel.create({
                firstName,
                lastName,
                email,
                password,
                role,
                cart: cart._id
            });

            // Generar token JWT
            const token = generateToken(user);

            // Actualizar la sesión con el ID del carrito
            req.session.cartId = cart._id;

            res.status(201).json({
                status: 'success',
                message: 'Usuario registrado exitosamente',
                payload: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Login de usuario
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario por email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isPasswordValid = user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Actualizar última conexión
            user.lastConnection = new Date();
            await user.save();

            console.log('Usuario autenticado correctamente:', user.email, 'Rol:', user.role);

            // Generar token JWT
            const token = generateToken(user);

            // Actualizar la sesión con el ID del carrito
            req.session.cartId = user.cart;

            res.json({
                status: 'success',
                message: 'Inicio de sesión exitoso',
                payload: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Obtener usuario actual
    static async getCurrentUser(req, res) {
        try {
            // El middleware de Passport ya ha verificado el token y ha añadido el usuario a req.user
            if (!req.user) {
                console.error('getCurrentUser - No hay usuario en la solicitud');
                return res.status(401).json({
                    status: 'error',
                    message: 'No autorizado'
                });
            }
            
            console.log('getCurrentUser - Usuario autenticado:', req.user.email, 'Rol:', req.user.role);
            
            res.json({
                status: 'success',
                payload: req.user
            });
        } catch (error) {
            console.error('Error en getCurrentUser:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Cerrar sesión
    static async logout(req, res) {
        try {
            // Actualizar última conexión
            if (req.user) {
                req.user.lastConnection = new Date();
                await req.user.save();
            }

            // Destruir la sesión
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error al cerrar sesión'
                    });
                }

                res.json({
                    status: 'success',
                    message: 'Sesión cerrada exitosamente'
                });
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Obtener historial de compras del usuario
    static async getPurchaseHistory(req, res) {
        try {
            const userId = req.user._id;
            
            // Buscar todos los carritos completados del usuario
            const completedCarts = await CartModel.find({ 
                user: userId, 
                status: 'completed' 
            })
            .populate('products.product')
            .sort({ completedAt: -1 });
            
            return res.status(200).json({
                status: 'success',
                payload: completedCarts
            });
        } catch (error) {
            console.error('Error al obtener historial de compras:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener historial de compras'
            });
        }
    }

    static async getUserPurchaseHistory(req, res) {
        try {
            const { userId } = req.params;
            
            // Verificar que el usuario solicitante sea administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tienes permisos para ver el historial de compras de otros usuarios'
                });
            }
            
            // Buscar el usuario
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            // Buscar las compras completadas del usuario
            const purchases = await CartModel.find({
                user: userId,
                status: 'completed'
            }).populate({
                path: 'products.product',
                select: 'title price finalPrice onSale thumbnails'
            }).sort({ completedAt: -1 }).lean();
            
            return res.status(200).json({
                status: 'success',
                payload: purchases
            });
        } catch (error) {
            console.error('Error al obtener historial de compras del usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener historial de compras'
            });
        }
    }
    
    static async changeUserRole(req, res) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            
            // Verificar que el usuario solicitante sea administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tienes permisos para cambiar el rol de otros usuarios'
                });
            }
            
            // Verificar que el rol sea válido
            if (role !== 'user' && role !== 'admin') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Rol no válido'
                });
            }
            
            // Buscar y actualizar el usuario
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { role },
                { new: true }
            );
            
            if (!updatedUser) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            return res.status(200).json({
                status: 'success',
                message: 'Rol actualizado correctamente',
                payload: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al cambiar el rol del usuario'
            });
        }
    }

    // Eliminar usuario
    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            
            // Verificar que el usuario solicitante sea administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tienes permisos para eliminar usuarios'
                });
            }
            
            // Verificar que el usuario exista
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }

            // Verificar que el usuario no tenga compras
            const purchases = await CartModel.find({
                user: userId,
                status: 'completed'
            });

            if (purchases.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se puede eliminar un usuario con compras registradas'
                });
            }

            // Eliminar el carrito activo del usuario si existe
            await CartModel.deleteMany({ user: userId });

            // Eliminar el usuario
            await UserModel.findByIdAndDelete(userId);
            
            return res.status(200).json({
                status: 'success',
                message: 'Usuario eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar el usuario'
            });
        }
    }
} 
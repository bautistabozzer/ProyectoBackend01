import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

// Opciones para la estrategia JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

// Estrategia JWT para autenticación
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log('JWT Payload recibido:', JSON.stringify(payload));
        
        if (!payload.id) {
            console.error('Payload no contiene ID de usuario');
            return done(null, false, { message: 'Token inválido' });
        }
        
        const user = await UserModel.findById(payload.id);
        
        if (!user) {
            console.log('Usuario no encontrado con ID:', payload.id);
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        
        console.log('Usuario autenticado correctamente:', user.email, 'Rol:', user.role);
        
        // Actualizar última conexión
        user.lastConnection = new Date();
        await user.save();
        
        return done(null, user);
    } catch (error) {
        console.error('Error en estrategia JWT:', error);
        return done(error, false);
    }
});

// Configuración de Passport
export const initializePassport = () => {
    passport.use('jwt', jwtStrategy);
    
    // Serialización y deserialización de usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

// Middleware para verificar autenticación con manejo de errores mejorado
export const authenticateJWT = (req, res, next) => {
    console.log('Verificando autenticación JWT...');
    console.log('Headers completos:', JSON.stringify(req.headers));
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No se encontró header de autorización');
    } else {
        console.log('Header de autorización encontrado:', authHeader.substring(0, 20) + '...');
    }
    
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Error en authenticateJWT:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
        
        if (!user) {
            console.log('Usuario no autenticado:', info?.message || 'Token no válido');
            return res.status(401).json({
                status: 'error',
                message: 'No autorizado'
            });
        }
        
        console.log('Usuario autenticado correctamente:', user.email, 'Rol:', user.role);
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware para verificar rol de administrador
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    console.log('Acceso denegado: se requiere rol de administrador. Rol actual:', req.user?.role);
    return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado: se requiere rol de administrador'
    });
};

// Middleware para verificar rol de usuario
export const isUser = (req, res, next) => {
    if (req.user) {
        return next();
    }
    console.log('Acceso denegado: debe iniciar sesión');
    return res.status(401).json({
        status: 'error',
        message: 'Acceso denegado: debe iniciar sesión'
    });
}; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto de usuario
 * @returns {String} Token JWT
 */
export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
    };
    
    console.log('Generando token JWT para:', user.email, 'Rol:', user.role);
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object|null} Payload decodificado o null si es inválido
 */
export const verifyToken = (token) => {
    try {
        if (!token) {
            console.error('Token no proporcionado');
            return null;
        }
        
        console.log('Verificando token:', token.substring(0, 20) + '...');
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token verificado correctamente:', decoded.email, 'Rol:', decoded.role);
        return decoded;
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        if (error.name === 'TokenExpiredError') {
            console.error('El token ha expirado');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Token malformado o firma inválida');
        }
        return null;
    }
};

/**
 * Extrae el token de los headers de la petición
 * @param {Object} req - Objeto de petición
 * @returns {String|null} Token JWT o null si no existe
 */
export const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No se encontró token en los headers');
        return null;
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token extraído de los headers');
    return token;
}; 
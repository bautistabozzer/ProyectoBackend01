import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.config.js';
import { helpers } from './utils/handlebars.helpers.js';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

// Rutas
import viewRoutes from './routes/view.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';

// Configuración de variables de entorno
dotenv.config();

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware esenciales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/multishop',
        ttl: 60 * 60 * 24
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());

// Middleware para depuración de autenticación
app.use((req, res, next) => {
    console.log('Ruta:', req.path);
    console.log('Método:', req.method);
    console.log('Headers de autenticación:', req.headers.authorization ? 
        `Presente (${req.headers.authorization.substring(0, 15)}...)` : 
        'No presente');
    console.log('Query params:', JSON.stringify(req.query));
    next();
});

// Configuración de Handlebars
app.engine('handlebars', engine({
    helpers,
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Almacenar io en app para uso en controladores
app.set('io', io);

// Rutas
app.use('/', viewRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Página no encontrada'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'Error interno del servidor'
    });
});

// Configuración de Socket.IO
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('Socket.IO: No se proporcionó token');
        return next(new Error('No autorizado'));
    }
    
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            console.log('Socket.IO: Token inválido');
            return next(new Error('Token inválido'));
        }
        
        socket.user = decoded;
        console.log('Socket.IO: Usuario autenticado:', decoded.email, 'Rol:', decoded.role);
        next();
    } catch (error) {
        console.error('Socket.IO: Error al verificar token:', error);
        next(new Error('Error de autenticación'));
    }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.user?.email || 'Anónimo');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.user?.email || 'Anónimo');
    });
});

// Conexión a la base de datos y inicio del servidor
const PORT = process.env.PORT || 8080;

try {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
}
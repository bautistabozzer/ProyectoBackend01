import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import UserManager from './fileManager/UserManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new UserManager('products.json');

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cargar productos iniciales
let products = [];
const loadProducts = async () => {
    try {
        products = await productManager.readFile();
        global.products = products;
        console.log('Productos cargados inicialmente:', products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
};
loadProducts();

// Rutas
app.get('/products', async (req, res) => {
    try {
        const productos = await productManager.readFile();
        console.log('Productos enviados a la vista products:', productos);
        res.render('products', { products: productos });
    } catch (error) {
        console.error('Error al cargar productos para la vista:', error);
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

app.use('/api/products', productsRouter);

// WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('requestProducts', async () => {
        const productos = await productManager.readFile();
        console.log('Productos enviados por socket:', productos);
        socket.emit('updateProducts', productos);
    });

    socket.on('addProduct', async (product) => {
        try {
            console.log('Producto recibido para agregar:', product);
            const productos = await productManager.readFile();
            product.id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
            productos.push(product);
            await productManager.writeFile(productos);
            console.log('Producto agregado y guardado:', product);
            io.emit('updateProducts', productos);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            console.log('ID de producto a eliminar:', id);
            const productos = await productManager.readFile();
            const filteredProducts = productos.filter(product => product.id !== parseInt(id));
            await productManager.writeFile(filteredProducts);
            console.log('Productos después de eliminar:', filteredProducts);
            io.emit('updateProducts', filteredProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
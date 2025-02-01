import { Router } from 'express';
import UserManager from '../fileManager/UserManager.js';

const router = Router();
const productManager = new UserManager('products.json');

// Vista de productos
router.get('/products', async (req, res) => {
    try {
        const productos = await productManager.readFile();
        res.render('products', { products: productos });
    } catch (error) {
        console.error('Error al cargar productos para la vista:', error);
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});

// Vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router; 
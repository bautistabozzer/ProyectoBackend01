import { ProductModel } from '../models/product.model.js';

export class ProductController {
    // Obtener todos los productos con filtros y paginación
    static async getProducts(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
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
            res.json({
                status: 'success',
                payload: products
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Obtener un producto por ID
    static async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductModel.findById(pid);
            
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                status: 'success',
                payload: product
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Crear un nuevo producto
    static async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await ProductModel.create(productData);
            
            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('productCreated', newProduct);

            res.status(201).json({
                status: 'success',
                payload: newProduct
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Actualizar un producto
    static async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updateData = req.body;
            
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                pid,
                updateData,
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('productUpdated', updatedProduct);

            res.json({
                status: 'success',
                payload: updatedProduct
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Eliminar un producto
    static async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const deletedProduct = await ProductModel.findByIdAndDelete(pid);

            if (!deletedProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }

            // Emitir evento de Socket.IO para actualización en tiempo real
            req.app.get('io').emit('productDeleted', pid);

            res.json({
                status: 'success',
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
} 
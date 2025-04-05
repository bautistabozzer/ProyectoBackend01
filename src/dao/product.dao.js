import { BaseDao } from './base.dao.js';
import { ProductModel } from '../models/product.model.js';

export class ProductDao extends BaseDao {
    constructor() {
        super(ProductModel);
    }

    async updateStock(productId, quantity) {
        try {
            const product = await this.getById(productId);
            if (!product) throw new Error('Producto no encontrado');

            if (product.stock < quantity) throw new Error('Stock insuficiente');

            product.stock -= quantity;
            return await product.save();
        } catch (error) {
            console.error('Error en ProductDao.updateStock:', error);
            throw error;
        }
    }

    async getProductsByCategory(category) {
        try {
            return await this.model.find({ category });
        } catch (error) {
            console.error('Error en ProductDao.getProductsByCategory:', error);
            throw error;
        }
    }

    async searchProducts(query) {
        try {
            return await this.model.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            });
        } catch (error) {
            console.error('Error en ProductDao.searchProducts:', error);
            throw error;
        }
    }

    async getProductsWithLowStock(threshold = 5) {
        try {
            return await this.model.find({ stock: { $lte: threshold } });
        } catch (error) {
            console.error('Error en ProductDao.getProductsWithLowStock:', error);
            throw error;
        }
    }

    async toggleProductStatus(productId) {
        try {
            const product = await this.getById(productId);
            if (!product) throw new Error('Producto no encontrado');

            product.status = !product.status;
            return await product.save();
        } catch (error) {
            console.error('Error en ProductDao.toggleProductStatus:', error);
            throw error;
        }
    }
} 
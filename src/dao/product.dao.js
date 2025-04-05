import { BaseDao } from './dao.interface.js';
import { ProductModel } from '../models/product.model.js';

export class ProductDao extends BaseDao {
    async getAll(options = {}) {
        try {
            return await ProductModel.paginate({}, options);
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    async create(productData) {
        try {
            return await ProductModel.create(productData);
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            const product = await ProductModel.findByIdAndUpdate(
                id,
                productData,
                { new: true, runValidators: true }
            );
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    // Métodos específicos para productos
    async updateStock(id, quantity) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            if (product.stock < quantity) {
                throw new Error('Stock insuficiente');
            }
            
            product.stock -= quantity;
            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar stock: ${error.message}`);
        }
    }

    async getByCategory(category) {
        try {
            return await ProductModel.find({ category });
        } catch (error) {
            throw new Error(`Error al obtener productos por categoría: ${error.message}`);
        }
    }
} 
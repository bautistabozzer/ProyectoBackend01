import { ProductDao } from '../dao/product.dao.js';
import { ProductDTO } from '../dto/product.dto.js';

export class ProductRepository {
    constructor() {
        this.dao = new ProductDao();
    }

    async getAllProducts(options = {}) {
        const products = await this.dao.getAll({}, options);
        return ProductDTO.fromArray(products);
    }

    async getProductById(id) {
        const product = await this.dao.getById(id);
        return ProductDTO.from(product);
    }

    async createProduct(productData) {
        const product = await this.dao.create(productData);
        return ProductDTO.from(product);
    }

    async updateProduct(id, productData) {
        const product = await this.dao.update(id, productData);
        return ProductDTO.from(product);
    }

    async deleteProduct(id) {
        return await this.dao.delete(id);
    }

    async updateStock(productId, quantity) {
        const product = await this.dao.updateStock(productId, quantity);
        return ProductDTO.from(product);
    }

    async getProductsByCategory(category) {
        const products = await this.dao.getProductsByCategory(category);
        return ProductDTO.fromArray(products);
    }

    async searchProducts(query) {
        const products = await this.dao.searchProducts(query);
        return ProductDTO.fromArray(products);
    }

    async getProductsWithLowStock(threshold) {
        const products = await this.dao.getProductsWithLowStock(threshold);
        return ProductDTO.fromArray(products);
    }

    async toggleProductStatus(productId) {
        const product = await this.dao.toggleProductStatus(productId);
        return ProductDTO.from(product);
    }

    async paginateProducts(filter = {}, options = {}) {
        const result = await this.dao.paginate(filter, options);
        return {
            ...result,
            docs: ProductDTO.fromArray(result.docs)
        };
    }
} 
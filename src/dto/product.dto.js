export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.status = product.status;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
        this.onSale = product.onSale;
        this.finalPrice = this.calculateFinalPrice(product.price, product.onSale);
        this.stockStatus = this.getStockStatus(product.stock);
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }

    calculateFinalPrice(price, onSale) {
        if (!onSale) return price;
        return price * 0.9; // 10% de descuento en productos en oferta
    }

    getStockStatus(stock) {
        if (stock <= 0) return 'Sin stock';
        if (stock <= 5) return 'Stock bajo';
        if (stock <= 10) return 'Stock medio';
        return 'Stock disponible';
    }

    static from(product) {
        if (!product) return null;
        return new ProductDTO(product);
    }

    static fromArray(products) {
        if (!products) return [];
        return products.map(product => ProductDTO.from(product));
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            code: this.code,
            price: this.price,
            finalPrice: this.finalPrice,
            status: this.status,
            stock: this.stock,
            stockStatus: this.stockStatus,
            category: this.category,
            thumbnails: this.thumbnails,
            onSale: this.onSale,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
} 
export class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.user = cart.user;
        this.products = this.processProducts(cart.products);
        this.status = cart.status;
        this.createdAt = cart.createdAt;
        this.completedAt = cart.completedAt;
        this.summary = this.generateSummary();
    }

    processProducts(products) {
        return products.map(item => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: this.calculateSubtotal(item)
        }));
    }

    calculateSubtotal(item) {
        if (!item.product || !item.product.finalPrice) return 0;
        return item.product.finalPrice * item.quantity;
    }

    generateSummary() {
        const totalItems = this.products.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = this.products.reduce((sum, item) => sum + item.subtotal, 0);
        const uniqueProducts = this.products.length;

        return {
            totalItems,
            uniqueProducts,
            totalAmount,
            averagePerItem: totalItems > 0 ? totalAmount / totalItems : 0
        };
    }

    static from(cart) {
        if (!cart) return null;
        return new CartDTO(cart);
    }

    static fromArray(carts) {
        if (!carts) return [];
        return carts.map(cart => CartDTO.from(cart));
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            products: this.products,
            status: this.status,
            createdAt: this.createdAt,
            completedAt: this.completedAt,
            summary: this.summary
        };
    }
} 
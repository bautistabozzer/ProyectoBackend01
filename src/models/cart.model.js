import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

// Middleware para popular los productos al consultar un carrito
cartSchema.pre('find', function() {
    this.populate('products.product');
});

cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

// Método para calcular el total del carrito
cartSchema.methods.calculateTotal = function() {
    return this.products.reduce((total, item) => {
        return total + (item.product.finalPrice * item.quantity);
    }, 0);
};

// Método para calcular el total sin descuentos
cartSchema.methods.calculateSubTotal = function() {
    return this.products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
};

// Método para calcular el ahorro total
cartSchema.methods.calculateSavings = function() {
    return this.calculateSubTotal() - this.calculateTotal();
};

export const CartModel = mongoose.model('Cart', cartSchema); 
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    finalPrice: {
        type: Number,
        min: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        default: []
    },
    onSale: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Middleware para calcular el precio final antes de guardar
productSchema.pre('save', function(next) {
    if (this.onSale) {
        this.finalPrice = this.price * 0.9; // 10% de descuento
    } else {
        this.finalPrice = this.price;
    }
    next();
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema); 
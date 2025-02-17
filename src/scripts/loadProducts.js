import { connectDB } from '../config/database.config.js';
import { ProductModel } from '../models/product.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '../../.env' });

const products = [
    // Categoría: Electrónica
    {
        title: "Smart TV 55 pulgadas",
        description: "Televisor LED 4K Ultra HD con Smart TV integrado",
        code: "TV55-4K",
        price: 199999.99,
        stock: 15,
        category: "Electrónica",
        thumbnails: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500"],
        onSale: true
    },
    {
        title: "Smartphone Galaxy Pro",
        description: "Teléfono inteligente con cámara de 108MP y 256GB",
        code: "SP-GAL-PRO",
        price: 149999.99,
        stock: 25,
        category: "Electrónica",
        thumbnails: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"]
    },
    
    // Categoría: Hogar
    {
        title: "Licuadora Professional",
        description: "Licuadora de 1000W con 5 velocidades",
        code: "LIC-PRO-1000",
        price: 24999.99,
        stock: 30,
        category: "Hogar",
        thumbnails: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500"],
        onSale: true
    },
    {
        title: "Juego de Sábanas Premium",
        description: "Juego de sábanas 100% algodón egipcio",
        code: "SAB-PREM-01",
        price: 15999.99,
        stock: 50,
        category: "Hogar",
        thumbnails: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500"]
    },

    // Categoría: Deportes
    {
        title: "Bicicleta Mountain Bike",
        description: "Bicicleta todo terreno con 21 velocidades",
        code: "BIKE-MTB-01",
        price: 89999.99,
        stock: 10,
        category: "Deportes",
        thumbnails: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500"],
        onSale: true
    },
    {
        title: "Set de Pesas",
        description: "Kit de pesas ajustables hasta 20kg",
        code: "GYM-PS-20",
        price: 19999.99,
        stock: 20,
        category: "Deportes",
        thumbnails: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500"]
    },

    // Categoría: Moda
    {
        title: "Zapatillas Running Pro",
        description: "Zapatillas deportivas con tecnología de amortiguación",
        code: "ZAP-RUN-01",
        price: 34999.99,
        stock: 40,
        category: "Moda",
        thumbnails: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
        onSale: true
    },
    {
        title: "Chaqueta Impermeable",
        description: "Chaqueta resistente al agua con capucha",
        code: "JACK-IMP-01",
        price: 29999.99,
        stock: 35,
        category: "Moda",
        thumbnails: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"]
    },

    // Categoría: Juguetes
    {
        title: "Drone con Cámara",
        description: "Drone con cámara HD y control remoto",
        code: "DRONE-CAM-01",
        price: 44999.99,
        stock: 15,
        category: "Juguetes",
        thumbnails: ["https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500"],
        onSale: true
    },
    {
        title: "Set de Construcción",
        description: "Kit de bloques de construcción 500 piezas",
        code: "TOY-CONST-01",
        price: 12999.99,
        stock: 45,
        category: "Juguetes",
        thumbnails: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500"]
    }
];

const loadProducts = async () => {
    try {
        await connectDB();
        
        // Eliminar productos existentes
        await ProductModel.deleteMany({});
        console.log('Base de datos limpiada');

        // Insertar nuevos productos
        const result = await ProductModel.insertMany(products);
        console.log(`Se han cargado ${result.length} productos exitosamente`);

        // Mostrar resumen por categoría
        const categories = [...new Set(products.map(p => p.category))];
        for (const category of categories) {
            const count = products.filter(p => p.category === category).length;
            console.log(`Categoría ${category}: ${count} productos`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        process.exit(1);
    }
};

loadProducts(); 
export const helpers = {
    // Comparación de igualdad
    eq: (a, b) => a === b,

    // Mayor que
    gt: (a, b) => a > b,

    // Menor que
    lt: (a, b) => a < b,

    // Multiplicación (útil para calcular subtotales)
    multiply: (a, b) => a * b,

    // Generar rango de números (útil para paginación)
    range: (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    },

    // Convertir objeto a JSON string (útil para data attributes)
    toJSON: (obj) => JSON.stringify(obj),

    // Formatear precio
    formatPrice: (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    },

    // Obtener primera letra de un string (útil para avatares)
    firstLetter: (str) => str.charAt(0).toUpperCase(),

    // Truncar texto
    truncate: (str, len) => {
        if (str.length > len) {
            return str.substring(0, len) + '...';
        }
        return str;
    },

    // Formatear fecha
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}; 
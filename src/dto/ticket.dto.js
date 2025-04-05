export class TicketDTO {
    constructor(ticket) {
        if (!ticket) {
            throw new Error('No se proporcionaron datos del ticket');
        }

        this.id = this.validateId(ticket._id);
        this.code = this.validateCode(ticket.code);
        this.purchase_datetime = this.validateDate(ticket.purchase_datetime);
        this.amount = this.validateAmount(ticket.amount);
        this.purchaser = this.validatePurchaser(ticket.purchaser);
        this.products = this.validateProducts(ticket.products);
        this.status = this.validateStatus(ticket.status);
        this.total = this.calculateTotal();
    }

    validateId(id) {
        if (!id) throw new Error('ID de ticket no válido');
        return id;
    }

    validateCode(code) {
        if (!code) throw new Error('Código de ticket no válido');
        return code;
    }

    validateDate(date) {
        if (!date) return new Date();
        return new Date(date);
    }

    validateAmount(amount) {
        if (typeof amount !== 'number' || amount < 0) {
            throw new Error('Monto no válido');
        }
        return amount;
    }

    validatePurchaser(purchaser) {
        if (!purchaser) throw new Error('Comprador no válido');
        return purchaser;
    }

    validateProducts(products) {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('Lista de productos no válida');
        }

        return products.map(p => ({
            product: p.product,
            quantity: this.validateQuantity(p.quantity),
            price: this.validatePrice(p.price),
            subtotal: p.quantity * p.price
        }));
    }

    validateQuantity(quantity) {
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Cantidad no válida');
        }
        return quantity;
    }

    validatePrice(price) {
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Precio no válido');
        }
        return price;
    }

    validateStatus(status) {
        const validStatus = ['pending', 'completed', 'failed'];
        if (!validStatus.includes(status)) {
            return 'pending'; // Valor por defecto si no es válido
        }
        return status;
    }

    calculateTotal() {
        return this.products.reduce((total, product) => total + product.subtotal, 0);
    }

    toJSON() {
        return {
            id: this.id,
            code: this.code,
            purchase_datetime: this.purchase_datetime,
            amount: this.amount,
            purchaser: this.purchaser,
            products: this.products,
            status: this.status,
            total: this.total
        };
    }

    static fromModel(ticket) {
        if (!ticket) return null;
        return new TicketDTO(ticket);
    }

    static fromModelArray(tickets) {
        if (!tickets) return [];
        return tickets.map(ticket => TicketDTO.fromModel(ticket));
    }
} 
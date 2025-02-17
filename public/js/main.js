document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Función para mostrar notificaciones
    const showToast = (message, type = 'success') => {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast';
        toastContainer.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">MultiShop</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer);
        toast.show();
        toastContainer.addEventListener('hidden.bs.toast', () => {
            toastContainer.remove();
        });
    };

    // Función para actualizar el contador del carrito
    const updateCartCount = (count) => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'inline' : 'none';
        }
    };

    // Función para formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    // Manejar eventos de Socket.IO
    socket.on('productCreated', (product) => {
        showToast(`Producto "${product.title}" creado exitosamente`);
    });

    socket.on('productUpdated', (product) => {
        showToast(`Producto "${product.title}" actualizado exitosamente`);
    });

    socket.on('productDeleted', (productId) => {
        showToast('Producto eliminado exitosamente', 'danger');
    });

    socket.on('cartUpdated', (cart) => {
        const totalProducts = cart.products.reduce((total, item) => total + item.quantity, 0);
        updateCartCount(totalProducts);
        showToast('Carrito actualizado exitosamente');
    });

    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Manejar formularios
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Procesando...
                `;
            }
        });
    });

    // Manejar imágenes rotas
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/img/placeholder.png';
        });
    });

    // Manejar scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Manejar botón "Volver arriba"
    const backToTop = document.createElement('button');
    backToTop.className = 'btn btn-primary position-fixed bottom-0 end-0 m-3 rounded-circle';
    backToTop.style.display = 'none';
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    // Manejar tema oscuro
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
    }

    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    });
}); 
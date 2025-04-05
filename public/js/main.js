document.addEventListener('DOMContentLoaded', () => {
    // Usar la variable socket global inicializada en el layout principal
    // const socket = io(); // Esta línea se elimina

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

    // Función para obtener el token JWT
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Función para verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return !!getToken();
    };

    // Función para realizar peticiones autenticadas
    const fetchWithAuth = async (url, options = {}) => {
        const token = getToken();
        if (!token) {
            console.error('No hay token disponible para la solicitud autenticada');
            window.location.href = '/login';
            return null;
        }
        
        // Asegurar que headers existe
        if (!options.headers) {
            options.headers = {};
        }
        
        // Añadir token de autorización
        options.headers['Authorization'] = `Bearer ${token}`;
        
        try {
            console.log(`Enviando solicitud autenticada a ${url}`);
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                console.error('Token expirado o inválido');
                localStorage.removeItem('token');
                window.location.href = '/login';
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('Error en fetchWithAuth:', error);
            return null;
        }
    };

    // Cargar datos del carrito al iniciar
    const loadCartCount = async () => {
        try {
            if (isAuthenticated()) {
                // Primero verificar si el usuario es admin
                const userResponse = await fetchWithAuth('/api/sessions/current');
                if (userResponse && userResponse.ok) {
                    const userData = await userResponse.json();
                    const isAdmin = userData.payload.user.role === 'admin';
                    
                    // Si es admin, ocultar el contador del carrito
                    if (isAdmin) {
                        const cartCount = document.getElementById('cart-count');
                        if (cartCount) {
                            cartCount.style.display = 'none';
                        }
                        return;
                    }
                    
                    // Si no es admin, cargar el contador normalmente
                    const response = await fetchWithAuth('/api/carts/current');
                    if (response && response.ok) {
                        const result = await response.json();
                        const totalProducts = result.payload.cart.products.reduce((total, item) => total + item.quantity, 0);
                        updateCartCount(totalProducts);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
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

    socket.on('cartUpdated', async (cart) => {
        // Verificar si el usuario es admin antes de actualizar el contador
        try {
            const userResponse = await fetchWithAuth('/api/sessions/current');
            if (userResponse && userResponse.ok) {
                const userData = await userResponse.json();
                const isAdmin = userData.payload.user.role === 'admin';
                
                // Solo actualizar el contador si no es admin
                if (!isAdmin) {
                    const totalProducts = cart.products.reduce((total, item) => total + item.quantity, 0);
                    updateCartCount(totalProducts);
                    showToast('Carrito actualizado exitosamente');
                }
            }
        } catch (error) {
            console.error('Error al verificar rol de usuario:', error);
        }
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

    // Exponer funciones útiles globalmente
    window.multishop = {
        showToast,
        updateCartCount,
        formatPrice,
        getToken,
        isAuthenticated,
        fetchWithAuth
    };

    // Cargar datos iniciales
    loadCartCount();
}); 
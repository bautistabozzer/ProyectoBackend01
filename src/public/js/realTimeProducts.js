const socket = io();

// Función para renderizar productos
function renderProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productHtml = `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Precio: $${product.price}</strong></p>
                        <p class="card-text">Stock: ${product.stock}</p>
                        <p class="card-text">Código: ${product.code}</p>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productHtml;
    });
}

// Manejar el envío del formulario
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value)
    };
    
    socket.emit('addProduct', product);
    e.target.reset();
});

// Función para eliminar producto
function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}

// Escuchar actualizaciones de productos
socket.on('updateProducts', (products) => {
    renderProducts(products);
});

// Solicitar lista inicial de productos
socket.emit('requestProducts'); 
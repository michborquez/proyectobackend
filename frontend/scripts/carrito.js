import { Cart } from './cart.js';

const cart = new Cart();

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(precio);
}

function mostrarItemsCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const items = cart.getItems();

    if (items.length === 0) {
        contenedor.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
        return;
    }

    contenedor.innerHTML = items.map(item => `
        <div class="cart-item card mb-3">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="http://localhost:5000/uploads/${item.imagen}" 
                         class="img-fluid rounded-start" 
                         alt="${item.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.nombre}</h5>
                        <p class="card-text">Precio: ${formatearPrecio(item.precio)}</p>
                        <div class="quantity-controls">
                            <button class="btn btn-sm btn-outline-primary decrease-quantity" 
                                    data-id="${item.id}">-</button>
                            <span class="quantity mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-primary increase-quantity" 
                                    data-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <button class="btn btn-danger remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    actualizarResumen();
    agregarEventosCarrito();
}

function actualizarResumen() {
    document.getElementById('subtotal').textContent = formatearPrecio(cart.getSubtotal());
    document.getElementById('iva').textContent = formatearPrecio(cart.getIVA());
    document.getElementById('total').textContent = formatearPrecio(cart.getTotal());
}

function agregarEventosCarrito() {
    // Eventos para eliminar items
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.remove-item').dataset.id);
            cart.removeItem(id);
            mostrarItemsCarrito();
        });
    });

    // Eventos para aumentar cantidad
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cart.getItems().find(item => item.id === id);
            cart.updateQuantity(id, item.quantity + 1);
            mostrarItemsCarrito();
        });
    });

    // Eventos para disminuir cantidad
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cart.getItems().find(item => item.id === id);
            if (item.quantity > 1) {
                cart.updateQuantity(id, item.quantity - 1);
            } else {
                cart.removeItem(id);
            }
            mostrarItemsCarrito();
        });
    });
}

// Inicializar la vista del carrito
document.addEventListener('DOMContentLoaded', () => {
    mostrarItemsCarrito();
});
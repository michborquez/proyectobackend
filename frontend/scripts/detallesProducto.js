import { obtenerDetallesProducto, obtenerReviewsProducto, agregarReviewProducto } from './apiProductos.js';
import { Cart } from './cart.js';

const cart = new Cart();

async function mostrarDetallesProducto(producto_id) {
    const contenedorDetalles = document.getElementById('contenedor-detalles');
    contenedorDetalles.innerHTML = '';

    try {
        const producto = await obtenerDetallesProducto(producto_id);
        const reviews = await obtenerReviewsProducto(producto_id);

        const detallesHTML = `
            <div class="producto-detalle">
                <div class="row">
                    <div class="col-md-6">
                        <img src="http://localhost:5000/uploads/${producto.imagen}" 
                             alt="${producto.nombre}" 
                             class="img-fluid">
                    </div>
                    <div class="col-md-6">
                        <h2>${producto.nombre}</h2>
                        <p class="precio">$${producto.precio.toFixed(2)}</p>
                        <p class="descripcion">${producto.descripcion}</p>
                        <button id="agregar-carrito" class="btn btn-primary btn-lg">
                            Agregar al carrito
                        </button>
                    </div>
                </div>

                <div class="reviews-section">
                    <h3>Opiniones de clientes</h3>
                    <div id="reviews">
                        ${reviews.map(review => `
                            <div class="review">
                                <p><strong>${review.usuario_nombre}:</strong> ${review.comentario}</p>
                                <p>Rating: ${review.calificacion}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="review-form">
                        <h4>Dejar una opinión</h4>
                        <form id="reviewForm">
                            <textarea id="comentario" placeholder="Escribe tu comentario"></textarea>
                            <input type="number" id="calificacion" min="1" max="5" placeholder="Calificación (1-5)">
                            <button type="submit">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>`;

        contenedorDetalles.innerHTML = detallesHTML;

        document.getElementById('reviewForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const comentario = document.getElementById('comentario').value;
            const calificacion = document.getElementById('calificacion').value;

            const review = { 
                comentario, 
                calificacion: parseInt(calificacion) 
            };

            try {
                const result = await agregarReviewProducto(producto_id, review);
                console.log(result);
                mostrarDetallesProducto(producto_id);  // Recargar los detalles y reviews
            } catch (error) {
                console.error('Error al agregar la reseña:', error);
            }
        });

        document.getElementById('agregar-carrito').addEventListener('click', () => {
            cart.addItem(producto);
            cart.updateCartCount();
            alert('Producto agregado al carrito');
        });
    } catch (error) {
        console.error('Error al mostrar detalles del producto:', error);
    }
}

// Obtener el ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const producto_id = urlParams.get('producto_id');
console.log('ID del producto:', producto_id);  // Verificar el ID del producto

if (producto_id) {
    mostrarDetallesProducto(producto_id);
} else {
    console.error('No se encontró el ID del producto.');
}
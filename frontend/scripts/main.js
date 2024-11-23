import { obtenerProductosPorCategoria } from './apiProductos.js';

// Función para mostrar productos filtrados por categoría
async function mostrarProductosCategoria(categoria_id) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    contenedorProductos.innerHTML = '';  // Limpiar el contenedor

    try {
        // Llamar a la API para obtener productos por categoría
        const productos = await obtenerProductosPorCategoria(categoria_id);
        console.log("Productos obtenidos:", productos);  // Depuración: Ver los productos obtenidos

        if (productos.length > 0) {
            productos.forEach(producto => {
                const card = crearTarjetaProducto(producto);
                contenedorProductos.appendChild(card);
            });
        } else {
            contenedorProductos.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        contenedorProductos.innerHTML = '<p>Error al cargar productos. Inténtalo de nuevo más tarde.</p>';
    }
}

async function mostrarDetallesProducto(producto_id) {
    const contenedorDetalles = document.getElementById('contenedor-detalles');
    contenedorDetalles.innerHTML = '';  // Limpiar el contenedor

    try {
        const producto = await obtenerDetallesProducto(producto_id);
        const reviews = await obtenerReviewsProducto(producto_id);

        const detallesHTML = `
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <h3>Reviews</h3>
            <div id="reviews">
                ${reviews.map(review => `
                    <div class="review">
                        <p>${review.comentario}</p>
                        <p>Rating: ${review.rating}</p>
                    </div>
                `).join('')}
            </div>
            <h3>Dejar una Review</h3>
            <form id="form-review">
                <textarea id="comentario" placeholder="Escribe tu comentario"></textarea>
                <input type="number" id="rating" min="1" max="5" placeholder="Rating (1-5)">
                <button type="submit">Enviar</button>
            </form>
        `;

        contenedorDetalles.innerHTML = detallesHTML;

        document.getElementById('form-review').addEventListener('submit', async (event) => {
            event.preventDefault();
            const comentario = document.getElementById('comentario').value;
            const rating = document.getElementById('rating').value;
            await agregarReviewProducto(producto_id, { comentario, rating });
            mostrarDetallesProducto(producto_id);  // Recargar los detalles y reviews
        });
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error.message);
        contenedorDetalles.innerHTML = '<p>Error al cargar detalles del producto. Inténtalo de nuevo más tarde.</p>';
    }
}

// Función para crear la tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'col-sm-6', 'product-card');

    const imagenUrl = `http://localhost:5000/uploads/${producto.imagen}`;
    const precioFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(producto.precio);

    card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${imagenUrl}" alt="${producto.nombre}" class="card-img-top lazyload">
            </div>
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${precioFormateado}</p>
                <a href="detallesproducto.html?producto_id=${producto.id}" class="btn btn-primary">Ver detalles</a>
            </div>
        </div>`;

    return card;
}

export async function agregarReviewProducto(producto_id, review) {
    const response = await fetch(`/api/productos/${producto_id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error al agregar review:', error);
        throw new Error(error.message || 'Error al agregar review');
    }

    return await response.json();
}

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const categoria_id = document.body.dataset.categoriaId;  // Obtener el ID de la categoría
    console.log("ID de la categoría:", categoria_id);  // Depuración: Ver el ID de la categoría

    if (categoria_id) {
        mostrarProductosCategoria(categoria_id);  // Llamamos a la función con el ID de la categoría
    } else {
        console.error('No se encontró el ID de la categoría.');
    }
});



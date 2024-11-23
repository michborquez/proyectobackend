import { obtenerProductos } from './apiProductos.js';

async function inicializarBuscador() {
    const productos = await obtenerProductos();
    
    document.getElementById('searchForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        // Filtrar productos que coincidan con el término de búsqueda
        const productosFiltrados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm)
        );

        if (productosFiltrados.length === 1) {
            // Si se encuentra un solo producto, redirigir a sus detalles
            window.location.href = `/frontend/pages/detallesproducto.html?producto_id=${productosFiltrados[0].id}`;
        } else if (productosFiltrados.length > 1) {
            // Si hay múltiples resultados, mostrar en una página de resultados
            mostrarResultados(productosFiltrados);
        } else {
            alert('No se encontraron productos que coincidan con tu búsqueda.');
        }
    });
}

function mostrarResultados(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');
        
        card.innerHTML = `
            <div class="card h-100">
                <img src="http://localhost:5000/uploads/${producto.imagen}" 
                     class="card-img-top" 
                     alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <a href="/frontend/pages/detallesproducto.html?producto_id=${producto.id}" 
                       class="btn btn-primary">Ver detalles</a>
                </div>
            </div>
        `;
        
        contenedor.appendChild(card);
    });

    // Hacer scroll a la sección de resultados
    document.querySelector('.featured-products').scrollIntoView({ behavior: 'smooth' });
}

// Inicializar el buscador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarBuscador);
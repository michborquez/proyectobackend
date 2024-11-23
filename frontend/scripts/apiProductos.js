const apiProductosURL = 'http://localhost:5000/api/productos';
const apiReviewsURL = 'http://localhost:5000/api/reviews';

// Obtener todos los productos
export async function obtenerProductos() {
    const response = await fetch(apiProductosURL);
    if (!response.ok) {
        throw new Error('Error al obtener productos');
    }
    const productos = await response.json();
    return productos;
}

// Obtener productos filtrados por categoría
export async function obtenerProductosPorCategoria(categoria_id) {
    const response = await fetch(`${apiProductosURL}/categoria/${categoria_id}`);
    if (!response.ok) {
        throw new Error('Error al obtener productos de la categoría');
    }
    const productos = await response.json();
    return productos;
}

// Obtener detalles de un producto
export async function obtenerDetallesProducto(producto_id) {
    const response = await fetch(`${apiProductosURL}/${producto_id}`);
    if (!response.ok) {
        throw new Error('Error al obtener detalles del producto');
    }
    const producto = await response.json();
    return producto;
}

// Obtener reviews de un producto
export async function obtenerReviewsProducto(producto_id) {
    const response = await fetch(`${apiProductosURL}/${producto_id}/reviews`);
    if (!response.ok) {
        throw new Error('Error al obtener reviews del producto');
    }
    const reviews = await response.json();
    return reviews;
}

// Agregar una review a un producto
export async function agregarReviewProducto(producto_id, review) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiProductosURL}/${producto_id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            comentario: review.comentario,
            calificacion: parseInt(review.calificacion)
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error al agregar review:', error);
        throw new Error(error.message || 'Error al agregar review');
    }

    return await response.json();
}

// Crear un nuevo producto
export async function crearProducto(producto, imagen) {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('categoria_id', producto.categoria_id);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(apiProductosURL, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al crear producto');
    }

    return await response.json();
}

// Actualizar un producto existente
export async function actualizarProducto(id, producto, imagen) {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('categoria_id', producto.categoria_id);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(`${apiProductosURL}/${id}`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al actualizar producto');
    }

    return await response.json();
}

// Eliminar un producto
export async function eliminarProducto(id) {
    const response = await fetch(`${apiProductosURL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Error al eliminar producto');
    }
}
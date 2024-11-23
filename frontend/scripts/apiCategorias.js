const apiCategoriasURL = 'http://localhost:5000/api/categorias';

// Obtener todas las categorías desde la API
export async function obtenerCategorias() {
    try {
        const response = await fetch(apiCategoriasURL);
        if (!response.ok) {
            throw new Error('Error al obtener categorías');
        }
        return await response.json();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las categorías. Por favor, intenta más tarde.',
            confirmButtonText: 'Aceptar'
        });
        console.error(error);
    }
}

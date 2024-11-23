// Agregar al inicio del archivo
function verificarToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No hay token almacenado');
        return false;
    }
    return true;
}

// Función para verificar si hay un usuario logueado
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    const publicRoutes = ['/frontend/pages/login.html', '/frontend/pages/register.html'];
    
    // Si estamos en una ruta pública y hay token, redirigir al inicio
    if (token && publicRoutes.includes(currentPath)) {
        window.location.href = '/frontend/index.html';
        return;
    }
    
    // Si no estamos en una ruta pública y no hay token, redirigir al login
    if (!token && !publicRoutes.includes(currentPath)) {
        window.location.href = '/frontend/pages/login.html';
        return;
    }
    
    // El resto de la lógica de checkAuthStatus
    const role = localStorage.getItem('role');
    const authButtons = document.querySelector('#auth-buttons');
    const userButtons = document.querySelector('#user-buttons');
    const adminButton = document.querySelector('#admin-button');
    const superAdminSection = document.querySelector('#superadmin-section');

    if (token) {
        if (authButtons) authButtons.style.display = 'none';
        if (userButtons) userButtons.style.display = 'inline-block';
        if (role === 'admin' || role === 'superadmin') {
            if (adminButton) adminButton.classList.remove('d-none');
        }
        if (role === 'superadmin' && superAdminSection) {
            superAdminSection.style.display = 'block';
        }
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Limpiar el rol también
    window.location.href = '/frontend/index.html';
}

// Verificar estado de autenticación cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el navbar se cargue
    setTimeout(checkAuthStatus, 100);
});

// Exportar funciones
window.cerrarSesion = cerrarSesion;
window.checkAuthStatus = checkAuthStatus;
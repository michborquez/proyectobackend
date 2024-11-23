// Función para manejar el login
export async function login(email, password) {
    try {
        const response = await fetch('http://localhost:5000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena: password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            if (window.checkAuthStatus) {
                window.checkAuthStatus();
            }
            window.location.href = '../index.html';
        } else {
            alert(data.message || 'Error en el login');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la solicitud');
    }
}

// Función para manejar el registro
export async function register(formData) {
    try {
        const response = await fetch('http://localhost:5000/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: formData.nombre,
                email: formData.email,
                contrasena: formData.contrasena,
                edad: formData.edad,
                pais: formData.pais,
                genero: formData.genero,
                newsletter: formData.newsletter
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = 'login.html';
        } else {
            console.error("Error en el registro", data);
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
    }
}

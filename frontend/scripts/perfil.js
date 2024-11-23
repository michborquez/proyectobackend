import { obtenerPerfil, actualizarPerfil } from '../scripts/apiAuth.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const perfil = await obtenerPerfil();
        console.log('Datos del perfil:', perfil);
        
        if (!perfil) {
            throw new Error('No se recibieron datos del perfil');
        }

        // Rellenar los campos del formulario de manera segura
        if (document.getElementById('nombre')) {
            document.getElementById('nombre').value = perfil.nombre || '';
        }
        if (document.getElementById('email')) {
            document.getElementById('email').value = perfil.email || '';
        }
        if (document.getElementById('edad')) {
            document.getElementById('edad').value = perfil.edad || '';
        }
        if (document.getElementById('pais')) {
            document.getElementById('pais').value = perfil.pais || '';
        }
        if (document.getElementById('genero')) {
            document.getElementById('genero').value = perfil.genero || 'masculino';
        }

        // Mostrar la foto de perfil si existe
        const avatarPreview = document.querySelector('.avatar-preview');
        if (avatarPreview && perfil.avatar) {
            avatarPreview.style.backgroundImage = `url('${perfil.avatar}')`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            avatarPreview.style.width = '100px';
            avatarPreview.style.height = '100px';
            avatarPreview.style.borderRadius = '50%';
            avatarPreview.style.display = 'block';
        }

        // Mostrar sección de superadmin si corresponde
        const role = localStorage.getItem('role');
        const superadminSection = document.getElementById('superadmin-section');
        if (role === 'superadmin' && superadminSection) {
            superadminSection.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        alert('Error al cargar los datos del perfil. Por favor, intenta nuevamente.');
    }
});

document.getElementById('perfilForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('edad', document.getElementById('edad').value);
    formData.append('pais', document.getElementById('pais').value);
    formData.append('genero', document.getElementById('genero').value);
    
    const avatarInput = document.getElementById('avatar');
    if (avatarInput.files[0]) {
        formData.append('avatar', avatarInput.files[0]);
    }

    try {
        const response = await actualizarPerfil(formData);
        
        if (response && response.avatar) {
            const avatarPreview = document.querySelector('.avatar-preview');
            if (avatarPreview) {
                avatarPreview.style.backgroundImage = `url('http://localhost:5000${response.avatar}')`;
                avatarPreview.style.backgroundSize = 'cover';
                avatarPreview.style.backgroundPosition = 'center';
                avatarPreview.style.width = '100px';
                avatarPreview.style.height = '100px';
                avatarPreview.style.borderRadius = '50%';
                avatarPreview.style.display = 'block';
            }
        }
        
        alert('Perfil actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
    }
});

// Agregar preview de imagen al seleccionar archivo
document.getElementById('avatar').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.querySelector('.avatar-preview');
            preview.style.backgroundImage = `url('${e.target.result}')`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
            preview.style.width = '100px';
            preview.style.height = '100px';
            preview.style.borderRadius = '50%';
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});
const express = require('express');
const { verificarToken, verificarAdmin, verificarSuperAdmin } = require('../middleware/verificarToken');
const { 
    createUser, 
    loginUser, 
    createAdmin, 
    obtenerPerfil, 
    actualizarPerfil, 
    createSuperAdmin 
} = require('../controllers/usuarios.controller');

const router = express.Router();

router.post('/usuarios', createUser);
router.post('/usuarios/login', loginUser);
router.post('/usuarios/superadmin', createSuperAdmin);
router.post('/usuarios/admin', verificarToken, verificarSuperAdmin, createAdmin);
router.get('/usuarios/perfil', verificarToken, obtenerPerfil);
router.put('/usuarios/perfil', verificarToken, actualizarPerfil);

module.exports = router;

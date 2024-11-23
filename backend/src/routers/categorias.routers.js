const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categorias.controller');

const router = express.Router();

// Definir las rutas
router.get('/categorias', getAllCategories);
router.get('/categorias/:id', getCategoryById);
router.post('/categorias', createCategory);
router.put('/categorias/:id', updateCategory);
router.delete('/categorias/:id', deleteCategory);

// Exportar el router
module.exports = router;
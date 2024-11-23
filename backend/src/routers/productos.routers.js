const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, upload, getProductsByCategory, getProductById  } = require('../controllers/productos.controller');

const router = express.Router();

// Rutas para productos
router.get('/productos', getAllProducts);
router.post('/productos', upload.single('imagen'), createProduct);  // Subir imagen con Multer
router.put('/productos/:id', upload.single('imagen'), updateProduct); // Actualizar con imagen
router.delete('/productos/:id', deleteProduct);
router.get('/productos/categoria/:categoria_id', getProductsByCategory);
router.get('/productos/:id', getProductById);

module.exports = router;

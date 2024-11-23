const db = require("../db/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para subir imágenes a la carpeta 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        // Crear el directorio si no existe
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Inicializar Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
});

const getProductsByCategory = (req, res) => {
    const { categoria_id } = req.params; 
    const query = `
        SELECT 
            productos.id,
            productos.nombre,
            productos.descripcion,
            productos.precio,
            productos.imagen,
            categorias.nombre AS categoria_nombre
        FROM 
            productos
        JOIN 
            categorias ON productos.categoria_id = categorias.id
        WHERE 
            productos.categoria_id = ?
    `;
    db.query(query, [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.status(200).json(results);
    });
};

const getAllProducts = (req, res) => {
    const query = `
        SELECT 
            productos.id,
            productos.nombre,
            productos.descripcion,
            productos.precio,
            productos.imagen,
            categorias.nombre AS categoria_nombre
        FROM 
            productos
        JOIN 
            categorias ON productos.categoria_id = categorias.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

const createProduct = (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;  // Imagen subida por Multer

    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'ID de categoría inválido' });
        }
        db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen) VALUES (?, ?, ?, ?, ?)', 
        [nombre, descripcion, precio, categoria_id, imagen], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Producto creado', productId: results.insertId });
        });
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'ID de categoría inválido' });
        }
        db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, imagen = ? WHERE id = ?', 
        [nombre, descripcion, precio, categoria_id, imagen, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto actualizado' });
        });
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    upload,
    getProductsByCategory
};

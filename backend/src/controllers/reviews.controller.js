const db = require("../db/db");
const jwt = require('jsonwebtoken');

/**
 * Obtener todas las reseñas de un producto
 */
const getReviewsByProduct = (req, res) => {
    const { producto_id } = req.params;
    const query = `
        SELECT 
            reviews.id, reviews.comentario, reviews.calificacion, reviews.fecha,
            usuarios.nombre AS usuario_nombre
        FROM reviews
        JOIN usuarios ON reviews.usuario_id = usuarios.id
        WHERE reviews.producto_id = ?
    `;
    db.query(query, [producto_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

/**
 * Crear una nueva reseña para un producto
 */
const createReview = (req, res) => {
    const { producto_id } = req.params;
    const { comentario, calificacion } = req.body;

    console.log('Datos recibidos:', { producto_id, comentario, calificacion });

    const usuario_id = obtenerUsuarioAutenticadoId(req);
    if (!usuario_id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const query = 'INSERT INTO reviews (producto_id, usuario_id, comentario, calificacion) VALUES (?, ?, ?, ?)';
    db.query(query, [producto_id, usuario_id, comentario, calificacion], (err, results) => {
        if (err) {
            console.error('Error SQL:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Reseña creada', reviewId: results.insertId });
    });
};

/**
 * Actualizar una reseña existente
 */
const updateReview = (req, res) => {
    const { id } = req.params;
    const { comentario, calificacion } = req.body;

    const query = 'UPDATE reviews SET comentario = ?, calificacion = ? WHERE id = ?';
    db.query(query, [comentario, calificacion, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }
        res.status(200).json({ message: 'Reseña actualizada' });
    });
};

/**
 * Eliminar una reseña
 */
const deleteReview = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM reviews WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }
        res.status(200).json({ message: 'Reseña eliminada' });
    });
};

const obtenerUsuarioAutenticadoId = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token recibido:', token);
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, 'secreto_super_seguro');
        console.log('Usuario decodificado:', decoded);
        return decoded.id;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return null;
    }
};

module.exports = {
    getReviewsByProduct,
    createReview,
    updateReview,
    deleteReview
};

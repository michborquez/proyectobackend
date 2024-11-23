const db = require("../db/db");

/**
 * Obtener todos los pedidos
 */
const getAllOrders = (req, res) => {
    db.query('SELECT * FROM pedidos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

/**
 * Obtener un pedido por su ID
 */
const getOrderById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM pedidos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

/**
 * Crear un nuevo pedido
 */
const createOrder = (req, res) => {
    const { usuario_id, total } = req.body;

    const query = 'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)';
    db.query(query, [usuario_id, total], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pedido creado', orderId: results.insertId });
    });
};

/**
 * Eliminar un pedido
 */
const deleteOrder = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pedidos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido eliminado' });
    });
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder
};

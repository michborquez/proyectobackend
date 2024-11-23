const db = require("../db/db");

/**
 * Obtener los detalles de un pedido específico
 */
const getOrderDetails = (req, res) => {
    const { pedido_id } = req.params;
    const query = `
        SELECT 
            detallespedido.id, detallespedido.cantidad, detallespedido.precio,
            productos.nombre AS producto_nombre
        FROM detallespedido
        JOIN productos ON detallespedido.producto_id = productos.id
        WHERE detallespedido.pedido_id = ?
    `;
    db.query(query, [pedido_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

/**
 * Agregar un producto al detalle de un pedido
 */
const addOrderDetail = (req, res) => {
    const { pedido_id, producto_id, cantidad, precio } = req.body;

    const query = 'INSERT INTO detallespedido (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)';
    db.query(query, [pedido_id, producto_id, cantidad, precio], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Detalle del pedido agregado', detailId: results.insertId });
    });
};

/**
 * Actualizar la cantidad o precio de un detalle de pedido
 */
const updateOrderDetail = (req, res) => {
    const { id } = req.params;
    const { cantidad, precio } = req.body;

    const query = 'UPDATE detallespedido SET cantidad = ?, precio = ? WHERE id = ?';
    db.query(query, [cantidad, precio, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
        }
        res.status(200).json({ message: 'Detalle de pedido actualizado' });
    });
};

/**
 * Eliminar un detalle de pedido
 */
const deleteOrderDetail = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM detallespedido WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
        }
        res.status(200).json({ message: 'Detalle de pedido eliminado' });
    });
};

module.exports = {
    getOrderDetails,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
};

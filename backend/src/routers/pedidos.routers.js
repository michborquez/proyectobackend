const express = require('express');
const {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder
} = require('../controllers/pedidos.controller');

const router = express.Router();

// Rutas para pedidos
router.get('/pedidos', getAllOrders);
router.get('/pedidos/:id', getOrderById);
router.post('/pedidos', createOrder);
router.delete('/pedidos/:id', deleteOrder);

module.exports = router;

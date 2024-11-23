const express = require('express');
const {
    getOrderDetails,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
} = require('../controllers/detallespedido.controller');

const router = express.Router();

// Rutas para detalles de pedidos
router.get('/pedidos/:pedido_id/detalles', getOrderDetails);
router.post('/pedidos/:pedido_id/detalles', addOrderDetail);
router.put('/detalles/:id', updateOrderDetail);
router.delete('/detalles/:id', deleteOrderDetail);

module.exports = router;

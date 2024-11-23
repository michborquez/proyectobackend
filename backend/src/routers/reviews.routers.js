const express = require('express');
const {
    getReviewsByProduct,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews.controller');

const router = express.Router();

router.get('/productos/:producto_id/reviews', getReviewsByProduct);
router.post('/productos/:producto_id/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

module.exports = router;

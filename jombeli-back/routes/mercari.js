const express = require('express');
const router = express.Router();

const {listSearch} = require('../controllers/mercari');


router.get('/mercari/search', listSearch);

// router.get('/products/categories', listCategories);
// router.post('/products/by/search', listBySearch);
// router.get('/product/photo/:productId', photo);

// router.param('userId', userById);
// router.param('productId', productById);



module.exports = router;


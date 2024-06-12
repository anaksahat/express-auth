const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');

// Route to get all orders
router.get('/oder', orderController.listOrders);

// Route to get a single order by ID
router.get('order/:id', orderController.getOrder);

// Route to create a new order
router.post('/create', orderController.createOrder);

// Route to update an existing order by ID
router.put('/update/:id', orderController.updateOrder);

// Route to delete an order by ID
router.delete('/delete/:id', orderController.deleteOrder);

// Route to create an order from cart items
router.post('/order/create-from-cart', orderController.createOrderFromCart);

module.exports = router;

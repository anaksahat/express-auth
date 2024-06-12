const { validationResult } = require("express-validator");
const database = require("../model/database");

async function createOrder(req, res) {
    const { UserID, items } = req.body; // items should be an array of { product_id, quantity, price }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        // Start transaction
        await database.beginTransaction();

        // Calculate total amount
        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Insert into order_details table
        const [orderResult] = await database.query(
            `INSERT INTO order_details (user_id, total_amount, status, created_at, updated_at) VALUES (?, ?, 'pending', NOW(), NOW())`,
            [UserID, totalAmount]
        );

        // Insert into order_items table
        await Promise.all(items.map(item => {
            return database.query(
                `INSERT INTO order_items (orderdetails_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [orderResult.insertId, item.product_id, item.quantity, item.price]
            );
        }));

        // Commit transaction
        await database.commit();

        res.status(201).json({ message: "Order created successfully!", OrderID: orderResult.insertId });
    } catch (error) {
        // Rollback transaction in case of error
        await database.rollback();
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getOrder(req, res) {
    const { orderId } = req.params;
    try {
        const [order] = await database.query(
            `SELECT * FROM order_details WHERE orderdetails_id = ?`,
            [orderId]
        );

        if (order.length > 0) {
            const [items] = await database.query(
                `SELECT * FROM order_items WHERE orderdetails_id = ?`,
                [orderId]
            );

            return res.json({ order: order[0], items });
        } else {
            return res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

async function updateOrder(req, res) {
    const { orderId } = req.params;
    const { UserID, totalAmount, items } = req.body;
    try {
        const [result] = await database.query(
            `UPDATE order_details SET user_id = ?, total_amount = ?, updated_at = NOW() WHERE orderdetails_id = ?`,
            [UserID, totalAmount, orderId]
        );

        if (result.affectedRows > 0) {
            // Update order_items table
            await Promise.all(items.map(item => {
                return database.query(
                    `UPDATE order_items SET product_id = ?, quantity = ?, price = ?, updated_at = NOW() WHERE orderdetails_id = ? AND orderitem_id = ?`,
                    [item.product_id, item.quantity, item.price, orderId, item.orderitem_id]
                );
            }));

            return res.status(200).json({ message: "Order updated successfully!" });
        } else {
            return res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteOrder(req, res) {
    const { orderId } = req.params;
    try {
        const [result] = await database.query(`DELETE FROM order_details WHERE orderdetails_id = ?`, [orderId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function listOrders(req, res) {
    try {
        const [orders] = await database.query(`SELECT * FROM order_details`);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createOrderFromCart(req, res) {
    const { useraccount_id } = req.body;  // Assuming you pass the user ID

    try {
        // Start transaction
        await database.beginTransaction();

        // Calculate total amount from cart
        const [cartItems] = await database.query(
            `SELECT item_id, quantity, (quantity * price) AS total_price FROM cart JOIN items ON cart.item_id = items.item_id WHERE useraccount_id = ?`,
            [useraccount_id]
        );
        const totalAmount = cartItems.reduce((acc, item) => acc + item.total_price, 0);

        // Insert into order_details
        const [orderResult] = await database.query(
            `INSERT INTO order_details (user_id, total_amount, status, created_at, updated_at) VALUES (?, ?, 'pending', NOW(), NOW())`,
            [useraccount_id, totalAmount]
        );

        // Insert cart items into order_items
        await Promise.all(cartItems.map(item => {
            return database.query(
                `INSERT INTO order_items (orderdetails_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [orderResult.insertId, item.item_id, item.quantity, item.price]
            );
        }));

        // Clear the cart
        await database.query(`DELETE FROM cart WHERE useraccount_id = ?`, [useraccount_id]);

        // Commit transaction
        await database.commit();

        res.status(201).json({ message: "Order created successfully from cart", OrderID: orderResult.insertId });
    } catch (error) {
        // Rollback transaction in case of error
        await database.rollback();
        console.error("Failed to create order from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    listOrders,
    createOrderFromCart
};

const database = require("../model/database");

// Add a new payment status
exports.addPaymentStatus = async (req, res) => {
    const { orderID, userID, transactionID, status_payment } = req.body;
    const manual_check_status = 'pending'; // Default status for manual check
    try {
        const sql = `INSERT INTO payment_status (orderID, userID, transactionID, status_payment, manual_check_status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
        const [result] = await database.query(sql, [orderID, userID, transactionID, status_payment, manual_check_status]);
        res.status(201).json({ message: "Payment status added and pending manual check", statusID: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding payment status" });
    }
};

// Get a payment status by ID
exports.getPaymentStatusById = async (req, res) => {
    const { statusID } = req.params;
    try {
        const sql = `SELECT * FROM payment_status WHERE statusID = ?`;
        const [result] = await database.query(sql, [statusID]);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: "Payment status not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error retrieving payment status" });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    const { statusID } = req.params;
    const { status_payment } = req.body;
    try {
        const sql = `UPDATE payment_status SET status_payment = ? WHERE statusID = ?`;
        const [result] = await database.query(sql, [status_payment, statusID]);
        if (result.affectedRows > 0) {
            res.json({ message: "Payment status updated" });
        } else {
            res.status(404).json({ error: "Payment status not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating payment status" });
    }
};

// Delete a payment status
exports.deletePaymentStatus = async (req, res) => {
    const { statusID } = req.params;
    try {
        const sql = `DELETE FROM payment_status WHERE statusID = ?`;
        const [result] = await database.query(sql, [statusID]);
        if (result.affectedRows > 0) {
            res.json({ message: "Payment status deleted" });
        } else {
            res.status(404).json({ error: "Payment status not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting payment status" });
    }
};


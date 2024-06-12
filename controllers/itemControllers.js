const { validationResult } = require("express-validator");
const database = require("../model/database");

async function createItem(req, res) {
    const { name, price, category, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    // Validate the category against the item_category table
    try {
        const [categoryExists] = await database.query(
            `SELECT 1 FROM item_category WHERE category = ?`,
            [category]
        );
        if (categoryExists.length === 0) {
            return res.status(400).json({ message: "Invalid category provided" });
        }
    } catch (error) {
        console.error("Category validation error:", error);
        return res.status(500).json({ error: "Error validating category" });
    }

    // Proceed with item creation if the category is valid
    try {
        const [newItem] = await database.query(
            `INSERT INTO item (name, price, category, description, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [name, price, category, description]
        );

        if (newItem.affectedRows > 0) {
            return res.status(201).json({ message: "Item created!", ItemID: newItem.insertId });
        } else {
            throw new Error("Failed to create item.");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

async function getItemById(req, res) {
    const { ItemID } = req.params;
    try {
        const [item] = await database.query(
            `SELECT * FROM item WHERE Item_id = ?`,
            [ItemID]
        );

        if (item.length > 0) {
            return res.json(item[0]);
        } else {
            return res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

async function updateItem(req, res) {
    const { ItemID } = req.params;
    const { name, price, category, description } = req.body;

    try {
        const [existingItem] = await database.query(
            `SELECT * FROM item WHERE Item_id = ?`,
            [ItemID]
        );

        if (existingItem.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        const [result] = await database.query(
            `UPDATE item SET name = ?, price = ?, category = ?, description = ?, updated_at = NOW() WHERE Item_id = ?`,
            [name, price, category, description, ItemID]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Item updated successfully!" });
        } else {
            return res.status(200).json({ message: "No changes made to the item." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteItem(req, res) {
    const { ItemID } = req.params;

    try {
        const [result] = await database.query(
            `DELETE FROM item WHERE Item_id = ?`,
            [ItemID]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Item deleted successfully!" });
        } else {
            return res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

async function getItemByCategory(req, res) {
    const { category } = req.params;

    try {
        const [items] = await database.query(
            "SELECT * FROM item WHERE category = ?",
            [category]
        );
        if (items.length > 0) {
            res.json(items);
        } else {
            res.status(404).json({ error: "No items found for this category" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getFavoriteItemByCategory(req, res) {
    const { userId, category } = req.params;

    try {
        const [items] = await database.query(
            "SELECT item.* FROM favorit JOIN item ON favorit.itemcategory_id = item.Item_id WHERE favorit.user_id = ? AND item.category = ?",
            [userId, category]
        );
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getTotalLikesPerItem(req, res) {
    try {
        const [likes] = await database.query(
            "SELECT itemcategory_id, COUNT(DISTINCT user_id) AS total_likes FROM favorit GROUP BY itemcategory_id"
        );
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getFavoritedItemsForMixAndMatch(req, res) {
    const { userId } = req.params;

    try {
        // Fetch favorited items for the user
        const [favoritedItems] = await database.query(
            `SELECT items.* FROM favorit 
             JOIN item ON favorit.item_id = item.item_id 
             WHERE favorit.UserID = ?`,
            [userId]
        );

        // Separate items into categories
        const categories = {
            clothes: [],
            trousers: [],
            shoes: []
        };

        favoritedItems.forEach(item => {
            if (item.category === 'clothes') {
                categories.clothes.push(item);
            } else if (item.category === 'trousers') {
                categories.trousers.push(item);
            } else if (item.category === 'shoes') {
                categories.shoes.push(item);
            }
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getItemsByType(req, res) {
    const { type } = req.params;

    try {
        const [items] = await database.query(
            "SELECT * FROM item WHERE type = ?",
            [type]
        );
        if (items.length > 0) {
            res.json(items);
        } else {
            res.status(404).json({ error: "No items found for this type" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getAllItems(req, res) {
    try {
        const [items] = await database.query("SELECT * FROM item");
        if (items.length > 0) {
            res.status(200).json(items);
        } else {
            res.status(404).json({ message: "No items found" });
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createItem,
    getItemById,
    updateItem,
    deleteItem,
    getItemByCategory,
    getFavoriteItemByCategory,
    getTotalLikesPerItem,
    getFavoritedItemsForMixAndMatch,
    getItemsByType,
    getAllItems
};

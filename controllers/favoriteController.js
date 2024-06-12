const database = require("../model/database");

// Add to favorite
const addToFavorite = async (req, res) => {
  const { useraccount_id, item_id } = req.body;  // Use the correct field names from the request body
  try {
    // Check if the item is already favorited by the user
    const [existing] = await database.query(
      `SELECT * FROM user_favorites WHERE useraccount_id = ? AND item_id = ?`, 
      [useraccount_id, item_id]
    );
    if (existing.length > 0) {
      // If the item is already favorited, respond accordingly (no need to increment like count based on your schema)
      res.status(200).json({ message: "Item already favorited" });
    } else {
      // Insert new favorite
      const [result] = await database.query(
        `INSERT INTO user_favorites (useraccount_id, item_id, liked_at) VALUES (?, ?, NOW())`, 
        [useraccount_id, item_id]
      );
      if (result.affectedRows > 0) {
        res.status(201).json({ message: "Item added to favorites!" });
      } else {
        res.status(500).json({ error: "Failed to add favorite" });
      }
    }
  } catch (error) {
    console.error("Error processing your request:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
};

// Remove from favorite
const removeFromFavorite = async (req, res) => {
  const { user_id, itemcategory_id } = req.body;
  try {
    const [result] = await database.query(`DELETE FROM user_favorites WHERE user_id = ? AND itemcategory_id = ?`, [user_id, itemcategory_id]);
    if (result.affectedRows > 0) {
      res.json({ message: "Item removed from favorites" });
    } else {
      res.status(404).json({ error: "Favorite not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing your request" });
  }
};

// List favorite by User
const listUserFavorites = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [results] = await database.query(
      `SELECT * FROM user_favorite JOIN item ON user_favorite.item_id = item.Item_id WHERE user_favorite.useraccount_id = ?`, 
      [user_id]
    );
    res.json({ favorites: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching favorites" });
  }
};

// Update Total Likes
const updateTotalLikes = async (req, res) => {
  const { favorit_id } = req.params;
  const { total_likes } = req.body;
  try {
    const [result] = await database.query(`UPDATE favorit SET total_likes = ? WHERE favorit_id = ?`, [total_likes, favorit_id]);
    if (result.affectedRows > 0) {
      res.json({ message: "Total likes updated" });
    } else {
      res.status(404).json({ error: "Favorite not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating total likes" });
  }
};

// Remove Favorite by ID
const removeFavoriteById = async (req, res) => {
  const { favorit_id } = req.params;
  try {
    const [result] = await database.query(`DELETE FROM favorit WHERE favorit_id = ?`, [favorit_id]);
    if (result.affectedRows > 0) {
      res.json({ message: "Favorite removed successfully" });
    } else {
      res.status(404).json({ error: "Favorite not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing your request" });
  }
};

module.exports = {
  addToFavorite,
  removeFromFavorite,
  listUserFavorites,
  updateTotalLikes,
  removeFavoriteById
};

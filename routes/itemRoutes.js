const express = require('express');
const router = express.Router();
const {createItem, updateItem, deleteItem, getItemByCategory, getFavoriteItemByCategory, getItemById, getFavoritedItemsForMixAndMatch, getItemsByType, getAllItems } = require('../controllers/itemControllers');


// Route to create a new item
router.post('/createitem', createItem);

// Route to get an item by ID
router.get('/getitemID/:ItemID', getItemById);

// Route to update an existing item
router.put('/updateitem/:ItemID', updateItem);

// Route to delete an item
router.delete('/deleteitem/:ItemID', deleteItem);

// Route to get items by category
router.get('/by-category/:Category', getItemByCategory);

// Route to get favorite items by category for a user
router.get('/favorites/:userId/:Category', getFavoriteItemByCategory);

// Route to get favorited items for mix and match
router.get('/favorited-items/:userId/mix-and-match', getFavoritedItemsForMixAndMatch);

// New route to get items by type
router.get('/by-type/:type', getItemsByType);

// New route to get all items
router.get('/items', getAllItems);

module.exports = router;
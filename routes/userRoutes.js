const express = require("express");
const app = express();
const router = express.Router();
const userController = require("../controllers/userController");
const { checkSchema } = require("express-validator");
const createUserValidation = require("../validations/createUserValidation");
const updateUserValidation = require("../validations/updateUserValidation");

// Get all users
router.get("/user", userController.getAllUsers);

// Register a new user
router.post(
  "/register",
  checkSchema(createUserValidation),
  userController.createNewUser
);

// Update a user by ID
router.put(
  "update/:id",
  checkSchema(updateUserValidation),
  userController.updateUserById
);

// Delete a user by ID
router.delete(
  "/:id",
  checkSchema(updateUserValidation),
  userController.deleteUserById
);

// Get a user by ID
router.get("/:id", userController.getUserById);

// Route to get a user by UserID
router.get('/by-userid/:userId', userController.getUserByUserID);

// Route to get a user by UserName
router.get('/by-username/:userName', userController.getUserByUserName);

// Login route
router.post('/login', userController.loginUser);

module.exports = router;

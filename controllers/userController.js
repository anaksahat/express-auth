const database = require("../model/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');  // Import UUIDv4

const getAllUsers = async (req, res) => {
  try {
    const [results] = await database.query(`SELECT * FROM useraccount`);
    res.json({
      users: results,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error getting users data",
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: "Please provide a user ID",
    });
  }
  try {
    const [results] = await database.query(`SELECT * FROM useraccount WHERE useraccount_id = ?`, [id]);
    res.json({
      user: results[0] || null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error getting user data by ID",
    });
  }
};

const getUserByUserID = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            error: "Please provide a user UserID",
        });
    }
    try {
        const [results] = await database.query(`SELECT * FROM useraccount WHERE user_id = ?`, [userId]);
        if (results.length > 0) {
            res.json({
                user: results[0]
            });
        } else {
            res.status(404).json({
                error: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error getting user data by UserID",
        });
    }
};

const getUserByUserName = async (req, res) => {
    const { userName } = req.params;
    if (!userName) {
        return res.status(400).json({
            error: "Please provide a user UserName",
        });
    }
    try {
        const [results] = await database.query(`SELECT * FROM useraccount WHERE username = ?`, [userName]);
        if (results.length > 0) {
            res.json({
                user: results[0]
            });
        } else {
            res.status(404).json({
                error: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error getting user data by UserName",
        });
    }
};

const createNewUser = async (req, res) => {
    const { username, Email, Password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    if (!Password) {
        return res.status(400).json({
            error: "Password is required"
        });
    }

    try {
        const user_id = uuidv4();

        const [user] = await database.query(
            `SELECT useraccount_id FROM useraccount WHERE email = ?`,
            [Email]
        );

        if (user.length > 0) {
            return res.status(409).json({
                error: "User already exists with this email!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const [result] = await database.query(
            `INSERT INTO useraccount (user_id, username, email, password) VALUES (?, ?, ?, ?)`,
            [user_id, username, Email, hashedPassword]
        );

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "New User Created!",
                user_id
            });
        } else {
            throw new Error("Failed to create user.");
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Bad request",
      errors: errors.array(),
    });
  }

  if (!password) {
    return res.status(400).json({
        error: "Password is required"
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await database.query(
      `UPDATE useraccount SET username = ?, email = ?, password = ? WHERE useraccount_id = ?`,
      [username, email, hashedPassword, id]
    );

    if (result.affectedRows > 0) {
      return res.json({ message: "User data updated!" });
    } else {
      res.status(500).json({ error: "Update data user failed" });
    }
  } catch (error) {
    console.log("Error while updating user data", error);
    res.status(500).json({ error: "Error while updating user data" });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: "Please provide a user ID",
    });
  }
  try {
    const [result] = await database.query(`DELETE FROM useraccount WHERE useraccount_id = ?`, [
      id,
    ]);

    if (result.affectedRows > 0)
      return res.json({
        message: `User has been DELETED with ID ${id}`,
      });

    return res.status(500).json({
      error: `Error deleting data ${id}`,
    });
  } catch (error) {
    console.log(`Error while deleting user with ${id}`);
    return res.status(500).json({
      error: `Error while deleting user with ${id}`,
    });
  }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Please provide both username and password",
        });
    }

    try {
        const [users] = await database.query(`SELECT * FROM useraccount WHERE username = ?`, [username]);
        if (users.length === 0) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.json({
                message: "Login successful",
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({
                error: "Invalid credentials",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error logging in user",
        });
    }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUserID,
  getUserByUserName,
  updateUserById,
  deleteUserById,
  createNewUser,
  loginUser,
};

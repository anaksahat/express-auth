const db = require("../model/database");
const { validationResult } = require("express-validator");

const test = (req, res) => {
  res.send("Hello from placeController!");
};

const getAllPlaces = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM place");
    res.status(200).json({
      payload: {
        message: "Successfully fetched all place",
        data: results,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, city, description, address } = req.body;
  const image_url = req.file ? req.file.filename : null;

  try {
    const [newPlace] = await db.query(
      `INSERT INTO places (name, city, description, address, image_url, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, city, description, address, image_url]
    );

    res.status(201).json({
      message: "Place created successfully!",
      placeId: newPlace.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPlaceById = async (req, res) => {
  const { id_place } = req.params;
  try {
    const [place] = await db.query(`SELECT * FROM places WHERE id_place = ?`, [
      id_place,
    ]);

    if (place.length > 0) {
      return res.json(place[0]);
    } else {
      return res.status(404).json({ error: "Place not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updatePlace = async (req, res) => {
  const { id_place } = req.params;
  const { name, city, description, address } = req.body;

  try {
    const [existingPlace] = await db.query(
      `SELECT * FROM places WHERE id_place = ?`,
      [id_place]
    );

    if (existingPlace.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    const [result] = await db.query(
      `UPDATE places SET name = ?, city = ?, description = ?, address = ?, updated_at = NOW() WHERE id_place = ?`,
      [name, city, description, address, id_place]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Place updated successfully!" });
    } else {
      return res.status(200).json({ message: "No changes made to the place." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deletePlace = async (req, res) => {
  const { id_place } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM places WHERE id_place = ?`, [
      id_place,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Place deleted successfully!" });
    } else {
      return res.status(404).json({ error: "Place not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPlaceByCity = async (req, res) => {
  const { city } = req.params;

  try {
    const [places] = await db.query("SELECT * FROM places WHERE city = ?", [
      city,
    ]);
    if (places.length > 0) {
      res.json(places);
    } else {
      res.status(404).json({ error: "No places found for this city" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  test,
  getAllPlaces,
  createPlace,
  getPlaceById,
  updatePlace,
  deletePlace,
  getPlaceByCity,
};

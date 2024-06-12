const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");

const upload = multer({ dest: "uploads/" });

const {
  test,
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getPlaceByCity,
  getPlaceById,
} = require("../controllers/placeController");

router.get("/test", test);

router.get("/places", getAllPlaces);

router.post(
  "/createplace",
  upload.single("image"),
  [
    body("name_place").notEmpty().withMessage("Place name is required"),
    body("city_place").notEmpty().withMessage("City is required"),
    body("description_place").notEmpty().withMessage("Description is required"),
  ],
  createPlace
);

router.get("/getplace/:id_place", getPlaceById);

router.put("/updateplace/:id_place", updatePlace);

router.delete("/deleteplace/:id_place", deletePlace);

router.get("/city/:city_place", getPlaceByCity);

module.exports = router;

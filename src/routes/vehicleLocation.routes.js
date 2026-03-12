const express = require("express");
const vehicleLocationController = require("../controllers/vehicleLocation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const vehicleLocationValidation = require("../validations/vehicleLocation.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/createVehicleLocation/:vehicleId", authMiddleware, vehicleLocationController.createVehicleLocation);

router.get("/getVehicleLocationByVehicleId/:vehicleId", authMiddleware, vehicleLocationController.getVehicleLocationByVehicleId);

router.put(
    "/vehicle/:vehicleId",
    authMiddleware,
    authorizeRoles("showroom"),
    vehicleLocationValidation.updateCurrentLocation,
    validate,
    vehicleLocationController.updateCurrentLocation
);

module.exports = router;

const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const adminValidation = require("../validations/admin.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/users", adminValidation.getUsers, validate, adminController.getUsers);
router.post("/showrooms", adminValidation.getShowrooms, validate, adminController.getShowrooms);
router.get("/dashboard", adminValidation.getDashboard, validate, adminController.getDashboard);
router.post("/revenue-report", adminValidation.getRevenueReport, validate, adminController.getRevenueReport);
router.post("/vehicle-locations", adminValidation.getVehicleLocations, validate, adminController.getVehicleLocations);
router.patch("/users/:id/status", adminValidation.updateUserStatus, validate, adminController.updateUserStatus);
router.patch("/showrooms/:id/status", adminValidation.updateShowroomStatus, validate, adminController.updateShowroomStatus);

module.exports = router;

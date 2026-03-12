const express = require("express");
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const reviewValidation = require("../validations/review.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    authorizeRoles("user"),
    reviewValidation.createReview,
    validate,
    reviewController.createReview
);

router.post(
    "/get-by-vehicle",
    reviewValidation.getReviewsByVehicleId,
    validate,
    reviewController.getReviewsByVehicleId
);

module.exports = router;

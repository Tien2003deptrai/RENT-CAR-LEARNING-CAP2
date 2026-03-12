const express = require("express");
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const paymentValidation = require("../validations/payment.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    authorizeRoles("user"),
    paymentValidation.createPayment,
    validate,
    paymentController.createPayment
);

module.exports = router;

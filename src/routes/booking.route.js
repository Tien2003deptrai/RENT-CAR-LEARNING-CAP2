const express = require("express");
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const bookingValidation = require("../validations/booking.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    authorizeRoles("user"),
    bookingValidation.createBooking,
    validate,
    bookingController.createBooking
);

router.post(
    "/my-bookings",
    authMiddleware,
    authorizeRoles("user"),
    bookingValidation.getMyBookings,
    validate,
    bookingController.getMyBookings
);

router.post(
    "/showroom-bookings",
    authMiddleware,
    authorizeRoles("showroom"),
    bookingValidation.getShowroomBookings,
    validate,
    bookingController.getShowroomBookings
);

router.get(
    "/:id",
    authMiddleware,
    bookingValidation.getBookingById,
    validate,
    bookingController.getBookingById
);

router.patch(
    "/:id/confirm",
    authMiddleware,
    authorizeRoles("showroom"),
    bookingValidation.confirmBooking,
    validate,
    bookingController.confirmBooking
);

router.patch(
    "/:id/cancel",
    authMiddleware,
    bookingValidation.cancelBooking,
    validate,
    bookingController.cancelBooking
);

router.patch(
    "/:id/confirm-payment",
    authMiddleware,
    authorizeRoles("showroom"),
    bookingValidation.confirmPayment,
    validate,
    bookingController.confirmPayment
);

router.patch(
    "/:id/handover",
    authMiddleware,
    authorizeRoles("showroom"),
    bookingValidation.handover,
    validate,
    bookingController.handover
);

router.patch(
    "/:id/confirm-received",
    authMiddleware,
    authorizeRoles("user"),
    bookingValidation.confirmReceived,
    validate,
    bookingController.confirmReceived
);

router.patch(
    "/:id/return",
    authMiddleware,
    authorizeRoles("user"),
    bookingValidation.returnVehicle,
    validate,
    bookingController.returnVehicle
);

router.patch(
    "/:id/confirm-return",
    authMiddleware,
    authorizeRoles("showroom"),
    bookingValidation.confirmReturn,
    validate,
    bookingController.confirmReturn
);

module.exports = router;

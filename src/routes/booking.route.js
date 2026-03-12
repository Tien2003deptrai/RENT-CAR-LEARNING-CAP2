const express = require("express");
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const bookingValidation = require("../validations/booking.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();
router.use(authMiddleware);

router.post(
    "/create",
    authorizeRoles("user"),
    bookingValidation.createBooking,
    validate,
    bookingController.createBooking
);

router.post(
    "/my-bookings",
    authorizeRoles("user"),
    bookingValidation.getMyBookings,
    validate,
    bookingController.getMyBookings
);

router.post(
    "/showroom-bookings",
    authorizeRoles("showroom"),
    bookingValidation.getShowroomBookings,
    validate,
    bookingController.getShowroomBookings
);

router.get(
    "/:id",
    bookingValidation.getBookingById,
    validate,
    bookingController.getBookingById
);

router.patch(
    "/:id/confirm",
    authorizeRoles("showroom"),
    bookingValidation.confirmBooking,
    validate,
    bookingController.confirmBooking
);

router.patch(
    "/:id/cancel",
    bookingValidation.cancelBooking,
    validate,
    bookingController.cancelBooking
);

router.patch(
    "/:id/confirm-payment",
    authorizeRoles("showroom"),
    bookingValidation.confirmPayment,
    validate,
    bookingController.confirmPayment
);

router.patch(
    "/:id/handover",
    authorizeRoles("showroom"),
    bookingValidation.handover,
    validate,
    bookingController.handover
);

router.patch(
    "/:id/confirm-received",
    authorizeRoles("user"),
    bookingValidation.confirmReceived,
    validate,
    bookingController.confirmReceived
);

router.patch(
    "/:id/return",
    authorizeRoles("user"),
    bookingValidation.returnVehicle,
    validate,
    bookingController.returnVehicle
);

router.patch(
    "/:id/confirm-return",
    authorizeRoles("showroom"),
    bookingValidation.confirmReturn,
    validate,
    bookingController.confirmReturn
);

module.exports = router;

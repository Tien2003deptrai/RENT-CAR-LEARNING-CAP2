const { body, param } = require("express-validator");

class BookingValidation {
    createBooking = [
        body("vehicle_id").notEmpty().withMessage("vehicle_id là bắt buộc").isMongoId().withMessage("vehicle_id phải là MongoId hợp lệ"),
        body("start_date").notEmpty().withMessage("start_date là bắt buộc").isISO8601().withMessage("start_date phải là ngày hợp lệ"),
        body("end_date")
            .notEmpty().withMessage("end_date là bắt buộc")
            .isISO8601().withMessage("end_date phải là ngày hợp lệ")
            .custom((end, { req }) => {
                const start = req.body?.start_date ? new Date(req.body.start_date) : null;
                if (start && new Date(end) <= start) throw new Error("end_date must be after start_date");
                return true;
            }),
        body("total_price").notEmpty().withMessage("total_price là bắt buộc").isFloat({ min: 0 }).withMessage("total_price phải là số không âm"),
        body("note").optional().trim().isLength({ max: 500 }).withMessage("note tối đa 500 ký tự"),
    ];

    getMyBookings = [
        body("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
    ];

    getShowroomBookings = [
        body("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
    ];

    getBookingById = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    confirmBooking = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    cancelBooking = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    confirmPayment = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    handover = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    confirmReceived = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    returnVehicle = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];

    confirmReturn = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
    ];
}

module.exports = new BookingValidation();

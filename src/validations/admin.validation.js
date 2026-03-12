const { body, param } = require("express-validator");

class AdminValidation {
    getUsers = [
        body("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
        body("is_active").optional().isIn(["true", "false"]).withMessage("is_active phải là true hoặc false"),
    ];

    getShowrooms = [
        body("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
        body("is_active").optional().isIn(["true", "false"]).withMessage("is_active phải là true hoặc false"),
    ];

    getDashboard = [];

    getRevenueReport = [
        body("year").optional().isInt({ min: 2000, max: 2100 }).withMessage("year không hợp lệ"),
    ];

    getVehicleLocations = [
        body("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
        body("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
    ];

    updateUserStatus = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
        body("is_active").notEmpty().withMessage("is_active là bắt buộc").toBoolean().isBoolean().withMessage("is_active phải là boolean"),
    ];

    updateShowroomStatus = [
        param("id").notEmpty().withMessage("id là bắt buộc").isMongoId().withMessage("id phải là MongoId hợp lệ"),
        body("is_active").notEmpty().withMessage("is_active là bắt buộc").toBoolean().isBoolean().withMessage("is_active phải là boolean"),
    ];
}

module.exports = new AdminValidation();

const { body } = require("express-validator");

class PaymentValidation {
    createPayment = [
        body("booking_id")
            .notEmpty()
            .withMessage("booking_id là bắt buộc")
            .isMongoId()
            .withMessage("booking_id phải là MongoId hợp lệ"),
    ];
}

module.exports = new PaymentValidation();

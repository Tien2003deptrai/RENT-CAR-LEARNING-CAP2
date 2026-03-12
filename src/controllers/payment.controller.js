const paymentService = require("../services/payment.service");

class PaymentController {
    async createPayment(req, res, next) {
        try {
            const userId = req.user.userId;
            const { booking_id } = req.body;
            const result = await paymentService.createPayment(booking_id, userId);
            return res.status(201).json({ message: "Payment created successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async handleWebhook(req, res, next) {
        try {
            const signature = req.headers["stripe-signature"] || "";
            const rawBody = req.body;
            const result = await paymentService.handleStripeWebhook(rawBody, signature);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();

const Stripe = require("stripe");
const paymentModel = require("../models/payment.model");
const bookingModel = require("../models/booking.model");
const throwError = require("../utils/throwError");

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

class PaymentService {
    async createPayment(bookingId, userId) {
        if (!stripe) throwError("Stripe chưa được cấu hình", 503);

        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.user_id.toString() !== userId) {
            throwError("Bạn chỉ có thể thanh toán cho đơn đặt của chính mình", 403);
        }
        if (!["confirmed", "waiting_payment"].includes(booking.status)) {
            throwError("Đơn đặt phải ở trạng thái `confirmed` hoặc `waiting_payment` để tạo thanh toán", 400);
        }

        const amount = Math.round(Number(booking.total_price));
        if (amount <= 0) throwError("Tổng tiền đơn đặt không hợp lệ", 400);

        const existing = await paymentModel.findOne({ booking_id: bookingId, payment_status: "successful" });
        if (existing) throwError("Đơn đặt này đã được thanh toán", 400);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "vnd",
            automatic_payment_methods: { enabled: true },
            metadata: { booking_id: String(bookingId) },
        });

        const payment = await paymentModel.create({
            booking_id: bookingId,
            amount: booking.total_price,
            currency: "vnd",
            payment_method: "stripe",
            payment_status: "pending",
            stripe_payment_intent_id: paymentIntent.id,
            paid_by: userId,
        });

        return {
            payment_id: payment._id,
            client_secret: paymentIntent.client_secret,
            stripe_payment_intent_id: paymentIntent.id,
        };
    }

    async handleStripeWebhook(rawBody, signature) {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throwError("Stripe webhook secret chưa được cấu hình", 503);
        }
        if (!stripe) throwError("Stripe chưa được cấu hình", 503);

        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            throwError(`Xác thực chữ ký webhook thất bại: ${err.message}`, 400);
        }

        if (event.type !== "payment_intent.succeeded") {
            return { received: true };
        }

        const paymentIntent = event.data.object;
        const payment = await paymentModel.findOne({ stripe_payment_intent_id: paymentIntent.id });
        if (!payment) return { received: true };
        if (payment.payment_status === "successful") return { received: true };

        payment.payment_status = "successful";
        payment.paid_at = new Date();
        payment.transaction_code = paymentIntent.id;
        await payment.save();

        await bookingModel.findByIdAndUpdate(payment.booking_id, { status: "paid" });
        return { received: true };
    }
}

module.exports = new PaymentService();

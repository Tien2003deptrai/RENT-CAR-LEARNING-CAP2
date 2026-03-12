const bookingModel = require("../models/booking.model");
const vehicleModel = require("../models/vehicle.model");
const paymentModel = require("../models/payment.model");
const BaseService = require("./base.service");
const throwError = require("../utils/throwError");

class BookingService {
    async createBooking(body, userId) {
        const { vehicle_id, start_date, end_date, total_price, note } = body;

        const vehicle = await vehicleModel.findById(vehicle_id);
        if (!vehicle) throwError("Không tìm thấy xe", 404);
        if (vehicle.status !== "available") {
            throwError("Xe hiện không sẵn sàng để cho thuê", 400);
        }

        const start = new Date(start_date);
        const end = new Date(end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start >= end) throwError("`start_date` phải trước `end_date`", 400);
        if (start < today) throwError("`start_date` phải là hôm nay hoặc trong tương lai", 400);

        const showroom_id = vehicle.added_by;

        const booking = await bookingModel.create({
            user_id: userId,
            showroom_id,
            vehicle_id,
            start_date: start,
            end_date: end,
            total_price: Number(total_price),
            status: "pending",
            note: note || "",
        });
        return booking;
    }

    async getMyBookings(userId, body = {}) {
        const filter = { user_id: userId };
        const pagination = BaseService.parsePagination(body);
        const sort = { createdAt: -1 };
        return BaseService.findPaginated(bookingModel, filter, sort, pagination);
    }

    async getShowroomBookings(showroomId, query = {}) {
        const filter = { showroom_id: showroomId };
        const pagination = BaseService.parsePagination(query);
        const sort = { createdAt: -1 };
        return BaseService.findPaginated(bookingModel, filter, sort, pagination);
    }

    async getBookingById(bookingId, userId, userRole) {
        const booking = await bookingModel
            .findById(bookingId)
            .populate("vehicle_id", "vehicle_name brand model vehicle_hire_rate_in_figures status")
            .populate("user_id", "name email")
            .populate("showroom_id", "name email")
            .lean();
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);

        const uid = booking.user_id && (booking.user_id._id || booking.user_id);
        const sid = booking.showroom_id && (booking.showroom_id._id || booking.showroom_id);
        const isOwner = uid && String(uid) === String(userId);
        const isShowroom = sid && String(sid) === String(userId);
        if (!isOwner && !isShowroom && userRole !== "admin") {
            throwError("Bạn chỉ có thể xem đơn đặt của mình hoặc của showroom của mình", 403);
        }
        return booking;
    }

    async confirmBooking(bookingId, showroomId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.showroom_id.toString() !== showroomId) {
            throwError("Chỉ showroom sở hữu xe này mới có thể xác nhận", 403);
        }
        if (booking.status !== "pending") {
            throwError("Chỉ đơn đặt ở trạng thái `pending` mới có thể xác nhận", 400);
        }

        booking.status = "confirmed";
        await booking.save();

        await vehicleModel.findByIdAndUpdate(booking.vehicle_id, { status: "reserved" });
        return booking;
    }

    async cancelBooking(bookingId, userId, userRole) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);

        const isOwner = booking.user_id.toString() === userId;
        const isShowroom = booking.showroom_id.toString() === userId;
        if (!isOwner && !isShowroom && userRole !== "admin") {
            throwError("Chỉ khách hàng hoặc showroom mới có thể hủy đơn đặt này", 403);
        }
        if (!["pending", "confirmed"].includes(booking.status)) {
            throwError("Chỉ đơn đặt ở trạng thái `pending` hoặc `confirmed` mới có thể hủy", 400);
        }

        booking.status = "cancelled";
        await booking.save();

        if (booking.vehicle_id) {
            await vehicleModel.findByIdAndUpdate(booking.vehicle_id, { status: "available" });
        }
        return booking;
    }

    async confirmPayment(bookingId, showroomId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.showroom_id.toString() !== showroomId) {
            throwError("Chỉ showroom sở hữu xe này mới có thể xác nhận thanh toán", 403);
        }
        if (!["confirmed", "waiting_payment"].includes(booking.status)) {
            throwError("Đơn đặt phải ở trạng thái `confirmed` hoặc `waiting_payment` để xác nhận thanh toán", 400);
        }

        const payment = await paymentModel.findOne({ booking_id: bookingId, payment_status: "successful" });
        if (!payment) throwError("Không tìm thấy thanh toán thành công cho đơn đặt này", 400);

        booking.status = "paid";
        await booking.save();
        return booking;
    }

    async handover(bookingId, showroomId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.showroom_id.toString() !== showroomId) {
            throwError("Chỉ showroom sở hữu xe này mới có thể bàn giao xe", 403);
        }
        if (booking.status !== "paid") {
            throwError("Đơn đặt phải được thanh toán trước khi bàn giao xe", 400);
        }

        booking.status = "handed_over";
        await booking.save();
        await vehicleModel.findByIdAndUpdate(booking.vehicle_id, { status: "rented" });
        return booking;
    }

    async confirmReceived(bookingId, userId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.user_id.toString() !== userId) {
            throwError("Chỉ khách hàng mới có thể xác nhận đã nhận xe", 403);
        }
        if (booking.status !== "handed_over") {
            throwError("Đơn đặt phải ở trạng thái `handed_over` trước khi xác nhận nhận xe", 400);
        }

        booking.status = "in_use";
        await booking.save();
        return booking;
    }

    async returnVehicle(bookingId, userId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.user_id.toString() !== userId) {
            throwError("Chỉ khách hàng mới có thể trả xe", 403);
        }
        if (booking.status !== "in_use") {
            throwError("Đơn đặt phải ở trạng thái `in_use` trước khi trả xe", 400);
        }

        booking.status = "waiting_return_confirmation";
        await booking.save();
        return booking;
    }

    async confirmReturn(bookingId, showroomId) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throwError("Không tìm thấy đơn đặt xe", 404);
        if (booking.showroom_id.toString() !== showroomId) {
            throwError("Chỉ showroom sở hữu xe này mới có thể xác nhận trả xe", 403);
        }
        if (booking.status !== "waiting_return_confirmation") {
            throwError("Đơn đặt phải ở trạng thái `waiting_return_confirmation` trước khi xác nhận trả xe", 400);
        }

        booking.status = "completed";
        await booking.save();
        await vehicleModel.findByIdAndUpdate(booking.vehicle_id, { status: "available" });
        return booking;
    }
}

module.exports = new BookingService();

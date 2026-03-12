const bookingService = require("../services/booking.service");

class BookingController {
    async createBooking(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await bookingService.createBooking(req.body, userId);
            return res.status(201).json({ message: "Booking created successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getMyBookings(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await bookingService.getMyBookings(userId, req.body);
            return res.status(200).json({ message: "My bookings received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async getShowroomBookings(req, res, next) {
        try {
            const showroomId = req.user.userId;
            const result = await bookingService.getShowroomBookings(showroomId, req.body);
            return res.status(200).json({ message: "Showroom bookings received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async getBookingById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const userRole = req.user.role;
            const result = await bookingService.getBookingById(id, userId, userRole);
            return res.status(200).json({ message: "Booking received successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async confirmBooking(req, res, next) {
        try {
            const { id } = req.params;
            const showroomId = req.user.userId;
            const result = await bookingService.confirmBooking(id, showroomId);
            return res.status(200).json({ message: "Booking confirmed successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async cancelBooking(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const userRole = req.user.role;
            const result = await bookingService.cancelBooking(id, userId, userRole);
            return res.status(200).json({ message: "Booking cancelled successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async confirmPayment(req, res, next) {
        try {
            const { id } = req.params;
            const showroomId = req.user.userId;
            const result = await bookingService.confirmPayment(id, showroomId);
            return res.status(200).json({ message: "Payment confirmed successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async handover(req, res, next) {
        try {
            const { id } = req.params;
            const showroomId = req.user.userId;
            const result = await bookingService.handover(id, showroomId);
            return res.status(200).json({ message: "Vehicle handed over successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async confirmReceived(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const result = await bookingService.confirmReceived(id, userId);
            return res.status(200).json({ message: "Receipt confirmed successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async returnVehicle(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const result = await bookingService.returnVehicle(id, userId);
            return res.status(200).json({ message: "Vehicle return registered successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async confirmReturn(req, res, next) {
        try {
            const { id } = req.params;
            const showroomId = req.user.userId;
            const result = await bookingService.confirmReturn(id, showroomId);
            return res.status(200).json({ message: "Return confirmed successfully", data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookingController();

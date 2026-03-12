const reviewService = require("../services/review.service");

class ReviewController {
    async createReview(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await reviewService.createOrUpdateReview(req.body, userId);
            return res.status(201).json({ message: "Review created or updated successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getReviewsByVehicleId(req, res, next) {
        try {
            const vehicleId = req.body.vehicle_id;
            const result = await reviewService.getReviewsByVehicleId(vehicleId, req.body);
            return res.status(200).json({ message: "Reviews received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();

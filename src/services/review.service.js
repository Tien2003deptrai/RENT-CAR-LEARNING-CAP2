const reviewModel = require("../models/review.model");
const vehicleModel = require("../models/vehicle.model");
const BaseService = require("./base.service");
const throwError = require("../utils/throwError");

class ReviewService {
    async createOrUpdateReview(body, userId) {
        const { vehicle_id, rating, comment } = body;

        const vehicle = await vehicleModel.findById(vehicle_id);
        if (!vehicle) throwError("Không tìm thấy xe", 404);

        const existing = await reviewModel.findOne({ user_id: userId, vehicle_id });
        const payload = { rating: Number(rating), comment: (comment || "").trim() };

        let review;
        if (existing) {
            review = await reviewModel.findOneAndUpdate(
                { user_id: userId, vehicle_id },
                payload,
                { new: true }
            );
        } else {
            review = await reviewModel.create({
                user_id: userId,
                vehicle_id,
                ...payload,
            });
        }
        return review;
    }

    async getReviewsByVehicleId(vehicleId, query = {}) {
        const vehicle = await vehicleModel.findById(vehicleId);
        if (!vehicle) throwError("Không tìm thấy xe", 404);

        const filter = { vehicle_id: vehicleId };
        const pagination = BaseService.parsePagination(query);
        const sort = { createdAt: -1 };

        const [data, total] = await Promise.all([
            reviewModel.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit).populate("user_id", "name email").lean(),
            reviewModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: Math.ceil(total / pagination.limit) || 0,
            },
        };
    }
}

module.exports = new ReviewService();

const userModel = require("../models/user.model");
const vehicleModel = require("../models/vehicle.model");
const bookingModel = require("../models/booking.model");
const paymentModel = require("../models/payment.model");
const vehicleLocationModel = require("../models/vehicleLocation.model");
const BaseService = require("./base.service");
const throwError = require("../utils/throwError");

class AdminService {
    async getUsers(query = {}) {
        const filter = { role: "user" };
        if (query.is_active !== undefined) {
            filter.is_active = String(query.is_active) === "true";
        }
        const pagination = BaseService.parsePagination(query);
        const sort = { createdAt: -1 };
        const result = await BaseService.findPaginated(userModel, filter, sort, pagination);
        const data = result.data.map((u) => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            is_active: u.is_active,
            createdAt: u.createdAt,
        }));
        return { data, pagination: result.pagination };
    }

    async getShowrooms(query = {}) {
        const filter = { role: "showroom" };
        if (query.is_active !== undefined) {
            filter.is_active = String(query.is_active) === "true";
        }
        const pagination = BaseService.parsePagination(query);
        const sort = { createdAt: -1 };
        const result = await BaseService.findPaginated(userModel, filter, sort, pagination);
        const data = result.data.map((u) => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            is_active: u.is_active,
            createdAt: u.createdAt,
        }));
        return { data, pagination: result.pagination };
    }

    async getDashboard() {
        const [totalUsers, totalShowrooms, totalVehicles, totalBookings, completedBookings, revenueResult] = await Promise.all([
            userModel.countDocuments({ role: "user" }),
            userModel.countDocuments({ role: "showroom" }),
            vehicleModel.countDocuments({}),
            bookingModel.countDocuments({}),
            bookingModel.countDocuments({ status: "completed" }),
            paymentModel.aggregate([
                { $match: { payment_status: "successful" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        const totalRevenue = revenueResult[0] ? revenueResult[0].total : 0;

        return {
            totalUsers,
            totalShowrooms,
            totalVehicles,
            totalBookings,
            completedBookings,
            totalRevenue,
        };
    }

    async getRevenueReport(query = {}) {
        const year = query.year ? parseInt(query.year, 10) : null;

        const match = {
            payment_status: "successful",
            paid_at: { $ne: null, $exists: true },
        };
        if (year && !Number.isNaN(year)) {
            match.$expr = { $eq: [{ $year: "$paid_at" }, year] };
        }

        const byMonth = await paymentModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        year: { $year: "$paid_at" },
                        month: { $month: "$paid_at" },
                    },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const data = byMonth.map((row) => ({
            year: row._id.year,
            month: row._id.month,
            totalAmount: row.totalAmount,
            transactionCount: row.count,
        }));

        return { data };
    }

    async getVehicleLocations(query = {}) {
        const filter = {};
        const pagination = BaseService.parsePagination(query);
        const sort = { updatedAt: -1 };

        const [data, total] = await Promise.all([
            vehicleLocationModel
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .populate("vehicle", "vehicle_name brand model status vehicle_plate_number")
                .lean(),
            vehicleLocationModel.countDocuments(filter),
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

    async updateUserStatus(userId, isActive) {
        const user = await userModel.findById(userId);
        if (!user) throwError("Không tìm thấy người dùng", 404);
        if (user.role !== "user") throwError("Đối tượng không phải tài khoản người dùng", 400);

        user.is_active = !!isActive;
        await user.save();

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
        };
    }

    async updateShowroomStatus(showroomId, isActive) {
        const showroom = await userModel.findById(showroomId);
        if (!showroom) throwError("Không tìm thấy showroom", 404);
        if (showroom.role !== "showroom") throwError("Đối tượng không phải tài khoản showroom", 400);

        showroom.is_active = !!isActive;
        await showroom.save();

        return {
            _id: showroom._id,
            name: showroom.name,
            email: showroom.email,
            role: showroom.role,
            is_active: showroom.is_active,
        };
    }
}

module.exports = new AdminService();

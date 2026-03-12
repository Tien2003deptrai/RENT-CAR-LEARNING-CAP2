const vehicleLocationModel = require("../models/vehicleLocation.model");
const vehicleModel = require("../models/vehicle.model");
const throwError = require("../utils/throwError");

class VehicleLocationService {
    async createVehicleLocation(location, vehicleId) {
        return vehicleLocationModel.create({ ...location, vehicle: vehicleId });
    }

    async getVehicleLocationByVehicleId(vehicleId) {
        return vehicleLocationModel.findOne({ vehicle: vehicleId }).sort({ updatedAt: -1 }).lean();
    }

    /**
     * Cập nhật vị trí hiện tại của xe (1 bản ghi/xe, upsert).
     * Chỉ showroom sở hữu xe mới gọi được – dùng cho giám sát xe (app/thiết bị gửi location định kỳ).
     */
    async updateCurrentLocation(vehicleId, showroomId, body) {
        const vehicle = await vehicleModel.findById(vehicleId);
        if (!vehicle) throwError("Không tìm thấy xe", 404);
        if (vehicle.added_by.toString() !== showroomId) {
            throwError("Chỉ showroom sở hữu xe này mới có thể cập nhật vị trí", 403);
        }

        const update = {
            address: body.address || "",
            latitude: String(body.latitude ?? ""),
            longitude: String(body.longitude ?? ""),
            plus_code: body.plus_code || "",
            vehicle: vehicleId,
        };

        const doc = await vehicleLocationModel.findOneAndUpdate(
            { vehicle: vehicleId },
            { $set: update },
            { upsert: true, new: true }
        );
        return doc;
    }
}

module.exports = new VehicleLocationService();

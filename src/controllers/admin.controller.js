const adminService = require("../services/admin.service");

class AdminController {
    async getUsers(req, res, next) {
        try {
            const result = await adminService.getUsers(req.body);
            return res.status(200).json({ message: "Users received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async getShowrooms(req, res, next) {
        try {
            const result = await adminService.getShowrooms(req.body);
            return res.status(200).json({ message: "Showrooms received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async getDashboard(req, res, next) {
        try {
            const result = await adminService.getDashboard();
            return res.status(200).json({ message: "Dashboard received successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getRevenueReport(req, res, next) {
        try {
            const result = await adminService.getRevenueReport(req.body);
            return res.status(200).json({ message: "Revenue report received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async getVehicleLocations(req, res, next) {
        try {
            const result = await adminService.getVehicleLocations(req.body);
            return res.status(200).json({ message: "Vehicle locations received successfully", ...result });
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            const result = await adminService.updateUserStatus(id, is_active);
            return res.status(200).json({ message: "User status updated successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateShowroomStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            const result = await adminService.updateShowroomStatus(id, is_active);
            return res.status(200).json({ message: "Showroom status updated successfully", data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();

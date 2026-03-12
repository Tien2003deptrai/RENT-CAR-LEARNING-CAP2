const userModel = require("../models/user.model");
const { signAccessToken } = require("../utils/jwt");
const throwError = require("../utils/throwError");
const { pick } = require("lodash");

class AuthService {
    async register(userData) {
        const userExists = await userModel.findOne({ email: userData.email });
        if (userExists) {
            throwError("Email đã được sử dụng");
        }
        return userModel.create(userData);
    }
    async login(userData) {
        const user = await userModel.findOne({ email: userData.email }).select("+password");
        if (!user) { throwError("Email hoặc mật khẩu không đúng"); }

        const isMatch = await user.comparePassword(userData.password);
        if (!isMatch) { throwError("Email hoặc mật khẩu không đúng"); }

        const token = signAccessToken({ userId: user._id, role: user.role });

        const safeUser = pick(user, ["_id", "email", "name", "role"]);

        return { user: safeUser, token };
    }
}

module.exports = new AuthService();

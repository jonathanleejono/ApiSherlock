"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("errors/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        (0, index_1.unAuthenticatedError)(res, "Invalid credentials, please login again");
        return;
    }
    const accessToken = authHeader.split(" ")[1];
    try {
        const accessTokenPayload = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.user = { userId: accessTokenPayload.userId };
        next();
    }
    catch (error) {
        (0, index_1.unAuthenticatedError)(res, "Error in credentials, please login again");
        return;
    }
};
exports.default = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map
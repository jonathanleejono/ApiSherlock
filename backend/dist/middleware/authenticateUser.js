"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("errors/index");
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        (0, index_1.unAuthenticatedError)(res, "Authentication Invalid");
        return;
    }
    const accessToken = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    }
    catch (error) {
        (0, index_1.unAuthenticatedError)(res, "Authentication Invalid");
        return;
    }
};
exports.default = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map
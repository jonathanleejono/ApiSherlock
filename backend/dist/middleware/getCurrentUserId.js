"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCurrentUserId = async (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUserId = payload.userId;
        return currentUserId;
    }
    catch (err) {
        return { error: err };
    }
};
exports.default = getCurrentUserId;
//# sourceMappingURL=getCurrentUserId.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("errors");
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const validateUserExists = async (req, res) => {
    if (!req.user) {
        (0, errors_1.unAuthenticatedError)(res, "Missing user");
        return;
    }
    if (!req.user.userId) {
        (0, errors_1.unAuthenticatedError)(res, "Missing user id");
        return;
    }
    const user = await UserCollection_1.default.findOne({ _id: req.user.userId });
    if (!user) {
        (0, errors_1.unAuthenticatedError)(res, "User not found!");
        return;
    }
    return user;
};
exports.default = validateUserExists;
//# sourceMappingURL=validateUserExists.js.map
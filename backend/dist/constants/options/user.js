"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validUpdateUserKeys = exports.validLoginKeys = exports.validRegisterKeys = void 0;
const UserCollection_1 = __importDefault(require("models/UserCollection"));
exports.validRegisterKeys = Object.keys(UserCollection_1.default.schema.obj);
exports.validLoginKeys = ["email", "password"];
exports.validUpdateUserKeys = ["name", "email", "timezoneGMT"];
//# sourceMappingURL=user.js.map
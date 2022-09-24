"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const closeMongoose = async () => {
    await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
    await mongoose_1.default.disconnect();
    await new Promise((res) => setTimeout(res, 1000));
};
exports.default = closeMongoose;
//# sourceMappingURL=closeMongoose.js.map
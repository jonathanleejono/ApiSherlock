"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoose = async (url) => {
    try {
        console.log("Connecting to MongoDB with url --------> ", url);
        await mongoose_1.default.connect(url);
    }
    catch (error) {
        console.log("Error connecting to MongoDB/Mongoose: ", error);
        return error;
    }
};
exports.default = connectMongoose;
//# sourceMappingURL=connectMongoose.js.map
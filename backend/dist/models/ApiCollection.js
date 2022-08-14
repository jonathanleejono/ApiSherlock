"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ApiSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: [true, "Please provide API URL"],
    },
    host: {
        type: String,
        enum: ["AWS", "GCP", "Azure", "Heroku", "DigitalOcean", "Other"],
        default: "Other",
    },
    status: {
        type: String,
        enum: ["healthy", "unhealthy", "pending"],
        default: "pending",
    },
    lastPinged: {
        type: String,
        required: [true, "Please provide last ping date and time"],
        default: "Never pinged",
    },
    monitoring: {
        type: String,
        enum: ["on", "off"],
        default: "off",
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
}, { timestamps: true });
const ApiCollection = mongoose_1.default.model("ApiCollection", ApiSchema);
exports.default = ApiCollection;
//# sourceMappingURL=ApiCollection.js.map
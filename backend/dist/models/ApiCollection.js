"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apis_1 = require("constants/options/apis");
const apis_2 = require("enum/apis");
const mongoose_1 = __importStar(require("mongoose"));
const ApiSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: [true, "Please provide API URL"],
    },
    host: {
        type: String,
        enum: apis_1.validApiHostOptions,
        default: apis_2.ApiHostOptions.OTHER,
    },
    status: {
        type: String,
        enum: apis_1.validApiStatusOptions,
        default: apis_2.ApiStatusOptions.PENDING,
    },
    lastPinged: {
        type: String,
        required: [true, "Please provide last ping date and time"],
        default: "Never pinged",
    },
    monitoring: {
        type: String,
        enum: apis_1.validApiMonitoringOptions,
        default: apis_2.ApiMonitoringOptions.OFF,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
}, { timestamps: true });
const ApiCollection = mongoose_1.default.model("ApiCollection", ApiSchema);
exports.default = ApiCollection;
//# sourceMappingURL=ApiCollection.js.map
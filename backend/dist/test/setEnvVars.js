"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.NODE_ENV = "testing";
const testDB = process.env.MONGO_URL_TEST;
process.env.MONGO_URL = testDB;
//# sourceMappingURL=setEnvVars.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("constants/messages");
const urls_1 = require("constants/urls");
const queueController_1 = require("controllers/queueController");
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importStar(require("server"));
const supertest_1 = __importDefault(require("supertest"));
describe("testing if supertest and jest works", () => {
    beforeAll(async () => {
        const databaseName = "test-ping";
        const url = `mongodb://127.0.0.1/${databaseName}`;
        await mongoose_1.default.connect(url);
    });
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
        await queueController_1.redisConfiguration.connection.quit();
        (0, server_1.closeServer)();
    });
    it("should ping server", async () => {
        const res = await (0, supertest_1.default)(server_1.default).get(urls_1.pingHealthCheckUrl);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(messages_1.pingHealthCheckSuccessMsg);
    });
});
//# sourceMappingURL=pingHealthCheck.test.js.map
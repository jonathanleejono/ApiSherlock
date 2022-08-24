"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("server"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const urls_1 = require("constants/urls");
const messages_1 = require("constants/messages");
describe("testing if supertest and jest works", () => {
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
    });
    it("should ping server", async () => {
        const res = await (0, supertest_1.default)(server_1.default).get(urls_1.pingHealthCheckUrl);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(messages_1.pingHealthCheckSuccessMsg);
    });
});
//# sourceMappingURL=pingHealthCheck.test.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const messages_1 = require("constants/messages");
const closeMongoose_1 = __importDefault(require("db/closeMongoose"));
const connectMongoose_1 = __importDefault(require("db/connectMongoose"));
const server_1 = __importDefault(require("server"));
const supertest_1 = __importDefault(require("supertest"));
const dbUrl_1 = require("test/dbUrl");
const databaseName = "test-ping";
let url = `mongodb://127.0.0.1/${databaseName}`;
if (process.env.USING_CI === "yes") {
    url = (0, dbUrl_1.createDbUrl)(databaseName);
}
describe("testing if supertest and jest works", () => {
    beforeAll(async () => {
        await (0, connectMongoose_1.default)(url);
    });
    afterAll(async () => {
        await (0, closeMongoose_1.default)();
    });
    it("should ping server", async () => {
        const res = await (0, supertest_1.default)(server_1.default).get(apiUrls_1.pingHealthCheckUrl);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(messages_1.pingHealthCheckSuccessMsg);
    });
});
//# sourceMappingURL=pingHealthCheck.test.js.map
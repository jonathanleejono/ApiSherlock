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
const cookies_1 = require("constants/cookies");
const urls_1 = require("constants/urls");
const queueController_1 = require("controllers/queueController");
const mockUser_1 = require("mocks/mockUser");
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importStar(require("server"));
const supertest_1 = __importDefault(require("supertest"));
const user = {
    name: "jane",
    email: "janedoe2@gmail.com",
    password: "password",
    timezoneGMT: -5,
};
const { name, email, password, timezoneGMT } = user;
describe("testing users controller", () => {
    beforeAll(async () => {
        const databaseName = "test-users";
        const url = `mongodb://127.0.0.1/${databaseName}`;
        await mongoose_1.default.connect(url);
        await UserCollection_1.default.collection.deleteMany({});
        await (0, supertest_1.default)(server_1.default).post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockUsersDbUrl}`);
    });
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
        await queueController_1.redisConfiguration.connection.quit();
        (0, server_1.closeServer)();
    });
    describe("given a user's name, email, and password", () => {
        it("should create a user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post(`${urls_1.baseAuthUrl}${urls_1.registerUserUrl}`)
                .send({
                name: name,
                email: email,
                password: password,
                timezoneGMT: timezoneGMT,
            });
            expect(response.statusCode).toBe(201);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toEqual(expect.objectContaining({
                accessToken: expect.any(String),
                user: { name, email, timezoneGMT },
            }));
        });
        it("should login a user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: mockUser_1.mockUser.password,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                accessToken: expect.any(String),
                user: {
                    name: mockUser_1.mockUser.name,
                    email: mockUser_1.mockUser.email,
                    timezoneGMT: mockUser_1.mockUser.timezoneGMT,
                },
            }));
        });
        it("should update a user", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: mockUser_1.mockUser.password,
            });
            const { accessToken } = loginResponse.body;
            const response = await (0, supertest_1.default)(server_1.default)
                .patch(`${urls_1.baseAuthUrl}${urls_1.updateUserUrl}`)
                .send({
                name: "bob",
                email: mockUser_1.mockUser.email,
                timezoneGMT: mockUser_1.mockUser.timezoneGMT,
            })
                .set("Authorization", `Bearer ${accessToken}`)
                .set("Cookie", loginResponse.header["set-cookie"]);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                accessToken: expect.any(String),
                user: {
                    name: "bob",
                    email: mockUser_1.mockUser.email,
                    timezoneGMT: mockUser_1.mockUser.timezoneGMT,
                },
            }));
        });
        it("should give unauthenticated response for wrong password", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: "Incorrect password",
            });
            expect(loginResponse.statusCode).toBe(401);
        });
    });
    describe("testing cookies", () => {
        it("should show cookies in header", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: mockUser_1.mockUser.password,
            });
            const cookieHeader = loginResponse.headers["set-cookie"];
            expect(loginResponse.statusCode).toBe(200);
            expect(cookieHeader).toBeTruthy();
            const cookie = cookieHeader[0];
            expect(cookie).toContain(cookies_1.cookieName);
        });
    });
});
//# sourceMappingURL=auth.test.js.map
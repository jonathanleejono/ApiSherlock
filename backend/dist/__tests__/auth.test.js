"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const closeMongoose_1 = __importDefault(require("db/closeMongoose"));
const connectMongoose_1 = __importDefault(require("db/connectMongoose"));
const mockUser_1 = require("mocks/mockUser");
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("server"));
const supertest_1 = __importDefault(require("supertest"));
const dbUrl_1 = require("test/dbUrl");
const user = {
    name: "jane",
    email: "janedoe2@gmail.com",
    password: "password",
    timezoneGMT: -5,
};
const databaseName = "test-users";
let url = `mongodb://127.0.0.1/${databaseName}`;
if (process.env.USING_CI === "yes") {
    url = (0, dbUrl_1.createDbUrl)(databaseName);
}
describe("testing users controller", () => {
    beforeAll(async () => {
        await (0, connectMongoose_1.default)(url);
        await (0, supertest_1.default)(server_1.default).post(`${apiUrls_1.baseSeedDbUrl}${apiUrls_1.seedMockUsersDbUrl}`);
    });
    afterAll(async () => {
        await mongoose_1.default.connection.db.dropDatabase();
        await (0, closeMongoose_1.default)();
    });
    describe("given a user's name, email, and password", () => {
        it("should create a user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.registerUserUrl}`)
                .send({
                name: user.name,
                email: user.email,
                password: user.password,
                timezoneGMT: user.timezoneGMT,
            });
            expect(response.statusCode).toBe(201);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toEqual(expect.objectContaining({
                user: {
                    id: expect.any(String),
                    name: user.name,
                    email: user.email,
                    timezoneGMT: user.timezoneGMT,
                },
                accessToken: expect.any(String),
            }));
        });
        it("should login a user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: mockUser_1.mockUser.password,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                user: {
                    id: expect.any(String),
                    name: mockUser_1.mockUser.name,
                    email: mockUser_1.mockUser.email,
                    timezoneGMT: mockUser_1.mockUser.timezoneGMT,
                },
                accessToken: expect.any(String),
            }));
        });
        it("should update a user", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: mockUser_1.mockUser.password,
            });
            const { accessToken } = loginResponse.body;
            const response = await (0, supertest_1.default)(server_1.default)
                .patch(`${apiUrls_1.baseAuthUrl}${apiUrls_1.authUserUrl}`)
                .send({
                name: "bob",
                email: mockUser_1.mockUser.email,
                timezoneGMT: mockUser_1.mockUser.timezoneGMT,
            })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                user: {
                    id: expect.any(String),
                    name: "bob",
                    email: mockUser_1.mockUser.email,
                    timezoneGMT: mockUser_1.mockUser.timezoneGMT,
                },
                accessToken: expect.any(String),
            }));
        });
        it("should get a user", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.loginUserUrl}`)
                .send({
                email: user.email,
                password: user.password,
            });
            const { accessToken } = loginResponse.body;
            const response = await (0, supertest_1.default)(server_1.default)
                .get(`${apiUrls_1.baseAuthUrl}${apiUrls_1.authUserUrl}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: expect.any(String),
                name: user.name,
                email: user.email,
                timezoneGMT: user.timezoneGMT,
            }));
        });
        it("should give unauthorized response for wrong password", async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.loginUserUrl}`)
                .send({
                email: mockUser_1.mockUser.email,
                password: "Incorrect password",
            });
            expect(loginResponse.statusCode).toBe(401);
        });
    });
    it("should give unauthorized response for invalid token ", async () => {
        const loginResponse = await (0, supertest_1.default)(server_1.default)
            .post(`${apiUrls_1.baseAuthUrl}${apiUrls_1.loginUserUrl}`)
            .send({
            email: mockUser_1.mockUser.email,
            password: mockUser_1.mockUser.password,
        });
        expect(loginResponse.statusCode).toBe(200);
        const response = await (0, supertest_1.default)(server_1.default)
            .patch(`${apiUrls_1.baseAuthUrl}${apiUrls_1.authUserUrl}`)
            .send({
            name: "bob",
            email: mockUser_1.mockUser.email,
            timezoneGMT: mockUser_1.mockUser.timezoneGMT,
        })
            .set("Authorization", `Bearer INVALID_TOKEN`);
        expect(response.statusCode).toBe(401);
    });
});
//# sourceMappingURL=auth.test.js.map
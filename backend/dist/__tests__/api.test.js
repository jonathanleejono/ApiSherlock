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
const apis_1 = require("enum/apis");
const mockApi_1 = require("mocks/mockApi");
const mockApis_1 = require("mocks/mockApis");
const mockApisStats_1 = require("mocks/mockApisStats");
const mockUpdatedApis_1 = require("mocks/mockUpdatedApis");
const mockUser_1 = require("mocks/mockUser");
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("server"));
const supertest_1 = __importStar(require("supertest"));
const getCurrentUserId_1 = __importDefault(require("utils/getCurrentUserId"));
const agent = (0, supertest_1.agent)(server_1.default);
let currentUserId = "";
let apiObjId;
let apiToDeleteId;
const mockUpdatedApi = mockUpdatedApis_1.mockUpdatedApis[0];
const mockQueryParamApi = mockApis_1.mockApis[1];
let testApiResponse = {
    url: "",
    host: "",
    monitoring: "",
    status: expect.any(String),
    lastPinged: expect.any(String),
    createdBy: expect.any(String),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
};
describe("testing api controller", () => {
    beforeAll(async () => {
        await (0, supertest_1.default)(server_1.default).delete(`${urls_1.baseSeedDbUrl}${urls_1.resetMockUsersDbUrl}`);
        await (0, supertest_1.default)(server_1.default).post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockUsersDbUrl}`);
        const response = await (0, supertest_1.default)(server_1.default)
            .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
            .send({
            email: mockUser_1.mockUser.email,
            password: mockUser_1.mockUser.password,
        });
        const { accessToken } = response.body;
        currentUserId = await (0, getCurrentUserId_1.default)(accessToken);
        const cookie = response.header["set-cookie"];
        await agent.auth(accessToken, { type: "bearer" }).set("Cookie", cookie);
        await agent.delete(`${urls_1.baseSeedDbUrl}${urls_1.resetMockApisDbUrl}`);
        await agent.post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockApisDbUrl}`);
    });
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
    });
    describe("testing apis", () => {
        it("should get all APIs", async () => {
            await new Promise((res) => setTimeout(res, 3000));
            const response = await agent.get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}`);
            const responseAllApis = response.body.allApis.reverse();
            apiObjId = responseAllApis[0]._id;
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(responseAllApis).toMatchObject(mockApis_1.mockApis);
            expect(response.body.totalApis).toEqual(mockApis_1.mockApis.length);
            expect(response.body.numOfPages).toEqual(Math.ceil(mockApis_1.mockApis.length / 10));
        });
        it("should get all APIs with query params", async () => {
            const response = await agent.get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}/?monitoring=${apis_1.ApiMonitoringOptions.OFF}`);
            testApiResponse.url = mockQueryParamApi.url;
            testApiResponse.host = mockQueryParamApi.host;
            testApiResponse.monitoring = mockQueryParamApi.monitoring;
            testApiResponse.createdBy = new mongoose_1.default.Types.ObjectId(`${currentUserId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.allApis).toMatchObject([testApiResponse]);
            expect(response.body.totalApis).toEqual(1);
            expect(response.body.numOfPages).toEqual(Math.ceil(1));
        });
        it("should create an api object", async () => {
            const response = await agent
                .post(`${urls_1.baseApiUrl}${urls_1.createApiUrl}`)
                .send(mockApi_1.mockApi);
            testApiResponse.url = mockApi_1.mockApi.url;
            testApiResponse.host = mockApi_1.mockApi.host;
            testApiResponse.monitoring = mockApi_1.mockApi.monitoring;
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(testApiResponse));
            apiToDeleteId = response.body._id;
        });
        it("should update an api object", async () => {
            const updatedData = {
                url: "https://battery-cellify.herokuapp22.com/ping",
            };
            const response = await agent
                .patch(`${urls_1.baseApiUrl}${urls_1.editApiUrl}/${apiObjId}`)
                .send({
                url: updatedData.url,
            });
            testApiResponse._id = new mongoose_1.default.Schema.Types.ObjectId(`${apiObjId}`);
            testApiResponse.url = updatedData.url;
            testApiResponse.host = mockApi_1.mockApi.host;
            testApiResponse.monitoring = mockApi_1.mockApi.monitoring;
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(testApiResponse));
        });
        it("should delete an api object", async () => {
            const response = await agent.delete(`${urls_1.baseApiUrl}${urls_1.deleteApiUrl}/${apiToDeleteId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(messages_1.deleteApiSuccessMsg));
        });
        it("should show stats of all apis", async () => {
            const response = await agent.get(`${urls_1.baseApiUrl}${urls_1.getAllApisStatsUrl}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(mockApisStats_1.mockApisStats));
        });
        describe("testing the pinging of APIs", () => {
            it("should ping api", async () => {
                const pingResponse = await agent.post(`${urls_1.baseApiUrl}${urls_1.pingOneApiUrl}/${apiObjId}`);
                expect(pingResponse.statusCode).toBe(200);
                expect(pingResponse.body).toEqual(messages_1.pingOneApiSuccessMsg);
                const response = await agent.get(`${urls_1.baseApiUrl}${urls_1.getApiUrl}/${apiObjId}`);
                testApiResponse._id = expect.any(String);
                testApiResponse.url = mockUpdatedApi.url;
                testApiResponse.status = mockUpdatedApi.status;
                testApiResponse.monitoring = mockUpdatedApi.monitoring;
                testApiResponse.createdBy = new mongoose_1.default.Types.ObjectId(`${currentUserId}`);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining(testApiResponse));
            });
            it("should ping all apis", async () => {
                const pingResponse = await agent.post(`${urls_1.baseApiUrl}${urls_1.pingAllApisUrl}`);
                await new Promise((res) => setTimeout(res, 3000));
                const response = await agent.get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}`);
                expect(pingResponse.statusCode).toBe(200);
                expect(pingResponse.body).toEqual(messages_1.pingAllApisSuccessMsg);
                expect(response.statusCode).toBe(200);
                expect(response.body.allApis.reverse()).toMatchObject(mockUpdatedApis_1.mockUpdatedApis);
            }, 30000);
        });
        describe("testing auth for api routes", () => {
            it("should throw unauthenticated error with wrong token", async () => {
                const response = await agent
                    .get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}`)
                    .set("Authorization", `Bearer INVALID_TOKEN`);
                expect(response.statusCode).toBe(401);
            });
        });
        it("should throw unauthenticated error with wrong cookie", async () => {
            const response = await agent
                .get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}`)
                .set("Cookie", `STALE_COOKIE`);
            expect(response.statusCode).toBe(401);
        });
    });
});
//# sourceMappingURL=api.test.js.map
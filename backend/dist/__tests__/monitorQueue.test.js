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
const monitor_1 = require("constants/options/monitor");
const urls_1 = require("constants/urls");
const queueController_1 = require("controllers/queueController");
const monitor_2 = require("enum/monitor");
const mockMonitor_1 = require("mocks/mockMonitor");
const mockUser_1 = require("mocks/mockUser");
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("server"));
const supertest_1 = __importStar(require("supertest"));
const getCurrentUserId_1 = __importDefault(require("utils/getCurrentUserId"));
const agent = (0, supertest_1.agent)(server_1.default);
let currentUserId;
const testMonitorResponse = {
    monitorSetting: expect.any(String),
    scheduleType: expect.any(String),
    intervalSchedule: expect.any(String),
    dateDayOfWeek: expect.any(Number),
    dateHour: expect.any(Number),
    dateMinute: expect.any(Number),
    dateAMOrPM: expect.any(String),
    _id: expect.any(String),
    createdBy: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
};
describe("testing monitor controller", () => {
    beforeAll(async () => {
        const databaseName = "test-monitors";
        const url = `mongodb://127.0.0.1/${databaseName}`;
        try {
            await mongoose_1.default.connect(url);
        }
        catch (error) {
            console.log("Error connecting to MongoDB/Mongoose: ", error);
        }
        await UserCollection_1.default.collection.deleteMany({});
        await (0, supertest_1.default)(server_1.default).post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockUsersDbUrl}`);
        const response = await (0, supertest_1.default)(server_1.default)
            .post(`${urls_1.baseAuthUrl}${urls_1.loginUserUrl}`)
            .send({
            email: mockUser_1.mockUser.email,
            password: mockUser_1.mockUser.password,
        });
        const { accessToken } = response.body;
        currentUserId = await (0, getCurrentUserId_1.default)(accessToken);
        if (!currentUserId) {
            console.error("Couldn't get current user id");
            return;
        }
        const cookie = response.header["set-cookie"];
        await agent.auth(accessToken, { type: "bearer" }).set("Cookie", cookie);
        await ApiCollection_1.default.collection.deleteMany({});
        await agent.post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockApisDbUrl}`);
        await MonitorCollection_1.default.collection.deleteMany({});
    });
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
        queueController_1.redisConfiguration.connection.disconnect();
        console.log("4: ", queueController_1.redisConfiguration.connection.status);
    });
    describe("testing monitor", () => {
        it("should not create monitor with setting off", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_2.MonitorSettingOptions.OFF;
            const response = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            Object.assign(testMonitorResponse, mockMonitor_1.mockMonitor);
            expect(response.statusCode).toBe(400);
        });
        it("should create monitor with setting ON", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_2.MonitorSettingOptions.ON;
            const response = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            Object.assign(testMonitorResponse, mockMonitor_1.mockMonitor);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(testMonitorResponse));
        });
        it("should not create a second monitor", async () => {
            const response = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            expect(response.statusCode).toBe(400);
        });
        it("should not delete a monitor with setting ON", async () => {
            const response = await agent.delete(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`);
            expect(response.statusCode).toBe(400);
        });
        it("should update monitor", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_2.MonitorSettingOptions.OFF;
            const response = await agent
                .patch(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            Object.assign(testMonitorResponse, mockMonitor_1.mockMonitor);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(testMonitorResponse));
        });
        it("should delete monitor", async () => {
            const response = await agent.delete(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(messages_1.deleteMonitorSuccessMsg));
        });
        it("should ping monitored apis in queue", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_2.MonitorSettingOptions.ON;
            mockMonitor_1.mockMonitor.scheduleType = monitor_2.MonitorScheduleTypeOptions.DATE;
            mockMonitor_1.mockMonitor.dateDayOfWeek =
                monitor_1.validMonitorDateDayOfWeekOptions[new Date().getDay()];
            if (new Date().getHours() > 12) {
                mockMonitor_1.mockMonitor.dateHour = new Date().getHours() - 12;
                mockMonitor_1.mockMonitor.dateAMOrPM = monitor_2.MonitorDateAMOrPMOptions.PM;
            }
            else {
                mockMonitor_1.mockMonitor.dateHour = new Date().getHours();
                mockMonitor_1.mockMonitor.dateAMOrPM = monitor_2.MonitorDateAMOrPMOptions.AM;
            }
            mockMonitor_1.mockMonitor.dateMinute = new Date().getMinutes();
            const createMonitorResp = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            expect(createMonitorResp.statusCode).toBe(201);
            const startQueueResp = await agent.post(`${urls_1.baseQueueUrl}${urls_1.handleQueueUrl}`);
            expect(startQueueResp.statusCode).toBe(200);
            await new Promise((res) => setTimeout(res, 3000));
            const getAllApisResp = await agent.get(`${urls_1.baseApiUrl}${urls_1.getAllApisUrl}`);
            const currentDateTime = new Date();
            const formattedDateTime = new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
            }).format(currentDateTime);
            expect(getAllApisResp.body.allApis[0].lastPinged).toContain(`${formattedDateTime},`);
            expect(getAllApisResp.body.allApis[0].lastPinged).toContain(`(GMT ${mockUser_1.mockUser.timezoneGMT})`);
        });
    });
});
//# sourceMappingURL=monitorQueue.test.js.map
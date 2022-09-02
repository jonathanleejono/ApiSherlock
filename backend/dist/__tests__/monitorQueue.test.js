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
const queue_1 = require("constants/queue");
const urls_1 = require("constants/urls");
const monitor_1 = require("enum/monitor");
const mockMonitor_1 = require("mocks/mockMonitor");
const mockUser_1 = require("mocks/mockUser");
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
        if (!currentUserId) {
            console.error("Couldn't get current user id");
            return;
        }
        const cookie = response.header["set-cookie"];
        await agent.auth(accessToken, { type: "bearer" }).set("Cookie", cookie);
        await agent.delete(`${urls_1.baseSeedDbUrl}${urls_1.resetMockApisDbUrl}`);
        await agent.post(`${urls_1.baseSeedDbUrl}${urls_1.seedMockApisDbUrl}`);
        await agent.delete(`${urls_1.baseSeedDbUrl}${urls_1.resetMockMonitorDbUrl}`);
    });
    afterAll(async () => {
        await Promise.all(mongoose_1.default.connections.map((con) => con.close()));
        await mongoose_1.default.disconnect();
    });
    describe("testing monitor", () => {
        it("should not create monitor with setting off", async () => {
            await new Promise((res) => setTimeout(res, 3000));
            mockMonitor_1.mockMonitor.monitorSetting = monitor_1.MonitorSettingOptions.OFF;
            const response = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            Object.assign(testMonitorResponse, mockMonitor_1.mockMonitor);
            expect(response.statusCode).toBe(400);
        });
        it("should create monitor with setting ON", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_1.MonitorSettingOptions.ON;
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
            mockMonitor_1.mockMonitor.monitorSetting = monitor_1.MonitorSettingOptions.OFF;
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
        it("should start queue", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_1.MonitorSettingOptions.ON;
            const createMonitorResp = await agent
                .post(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            expect(createMonitorResp.statusCode).toBe(201);
            const startQueueResp = await agent.post(`${urls_1.baseQueueUrl}${urls_1.handleQueueUrl}`);
            expect(startQueueResp.statusCode).toBe(200);
            const myQueue = await (0, queue_1.getQueue)();
            const repeatableJobs = await myQueue.getRepeatableJobs();
            expect(repeatableJobs[0].name).toContain(`${queue_1.jobBaseName}-${mockUser_1.mockUser.email}`);
            expect(repeatableJobs[0].cron).toEqual((1000 * 60 * 60).toString());
        });
        it("should remove monitor and jobs from queue", async () => {
            mockMonitor_1.mockMonitor.monitorSetting = monitor_1.MonitorSettingOptions.OFF;
            await agent
                .patch(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            const deleteMonitorResp = await agent
                .delete(`${urls_1.baseMonitorUrl}${urls_1.handleMonitorUrl}`)
                .send(mockMonitor_1.mockMonitor);
            expect(deleteMonitorResp.statusCode).toBe(200);
            const removeQueueResp = await agent.delete(`${urls_1.baseQueueUrl}${urls_1.handleQueueUrl}`);
            expect(removeQueueResp.statusCode).toBe(200);
            const myQueue = await (0, queue_1.getQueue)();
            const repeatableJobs = await myQueue.getRepeatableJobs();
            expect(repeatableJobs).toEqual([]);
        });
    });
});
//# sourceMappingURL=monitorQueue.test.js.map
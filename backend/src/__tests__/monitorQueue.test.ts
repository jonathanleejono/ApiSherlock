import { deleteMonitorSuccessMsg } from "constants/messages";
import { getQueue, jobBaseName } from "constants/queue";
import {
  baseAuthUrl,
  baseMonitorUrl,
  baseQueueUrl,
  baseSeedDbUrl,
  handleMonitorUrl,
  handleQueueUrl,
  loginUserUrl,
  seedMockApisDbUrl,
  seedMockUsersDbUrl,
} from "constants/urls";
import { redisConfiguration } from "controllers/queueController";
import { MonitorSettingOptions } from "enum/monitor";
import { mockMonitor } from "mocks/mockMonitor";
import { mockUser } from "mocks/mockUser";
import ApiCollection from "models/ApiCollection";
import MonitorCollection from "models/MonitorCollection";
import { Monitor } from "models/MonitorDocument";
import UserCollection from "models/UserCollection";
import mongoose, { Schema } from "mongoose";
import app from "server";
import request, { agent as supertest } from "supertest";
import getCurrentUserId from "utils/getCurrentUserId";

const agent = supertest(app);

let currentUserId: Schema.Types.ObjectId;

const testMonitorResponse: Monitor = {
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
    await mongoose.connect(url);

    await UserCollection.collection.deleteMany({});
    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);
    const response = await request(app)
      .post(`${baseAuthUrl}${loginUserUrl}`)
      .send({
        email: mockUser.email,
        password: mockUser.password,
      });
    const { accessToken } = response.body;

    // req.user.userId isn't present in supertest,
    // which is why a getCurrentUserId function is used
    currentUserId = await getCurrentUserId(accessToken);

    if (!currentUserId) {
      console.error("Couldn't get current user id");
      return;
    }

    const cookie = response.header["set-cookie"];
    await agent.auth(accessToken, { type: "bearer" }).set("Cookie", cookie);

    await ApiCollection.collection.deleteMany({});
    await agent.post(`${baseSeedDbUrl}${seedMockApisDbUrl}`);

    await MonitorCollection.collection.deleteMany({});
  });

  afterAll(async () => {
    //all of this is to prevent memory leaks
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
    await redisConfiguration.connection.quit();
  });

  describe("testing monitor", () => {
    it("should not create monitor with setting off", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.OFF;

      const response = await agent
        .post(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      //only assigns/updates with overlapping properties
      Object.assign(testMonitorResponse, mockMonitor);

      expect(response.statusCode).toBe(400);
    });

    it("should create monitor with setting ON", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.ON;

      const response = await agent
        .post(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      //only assigns/updates with overlapping properties
      Object.assign(testMonitorResponse, mockMonitor);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining(testMonitorResponse)
      );
    });

    it("should not create a second monitor", async (): Promise<void> => {
      const response = await agent
        .post(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      expect(response.statusCode).toBe(400);
    });

    it("should not delete a monitor with setting ON", async (): Promise<void> => {
      const response = await agent.delete(
        `${baseMonitorUrl}${handleMonitorUrl}`
      );

      expect(response.statusCode).toBe(400);
    });

    it("should update monitor", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.OFF;

      const response = await agent
        .patch(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      //only assigns/updates with overlapping properties
      Object.assign(testMonitorResponse, mockMonitor);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining(testMonitorResponse)
      );
    });

    it("should delete monitor", async (): Promise<void> => {
      const response = await agent.delete(
        `${baseMonitorUrl}${handleMonitorUrl}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining(deleteMonitorSuccessMsg)
      );
    });

    it("should start queue", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.ON;

      //make sure this is base monitor url
      const createMonitorResp = await agent
        .post(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      expect(createMonitorResp.statusCode).toBe(201);

      //and this is base queue url
      const startQueueResp = await agent.post(
        `${baseQueueUrl}${handleQueueUrl}`
      );

      expect(startQueueResp.statusCode).toBe(200);

      const myQueue = await getQueue();

      const repeatableJobs = await myQueue.getRepeatableJobs();

      expect(repeatableJobs[0].name).toContain(
        `${jobBaseName}-${mockUser.email}`
      );

      expect(repeatableJobs[0].cron).toEqual((1000 * 60 * 60).toString());

      //place this exactly here to prevent memory leaks
      await redisConfiguration.connection.quit();
    });

    it("should remove monitor and jobs from queue", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.OFF;

      await agent
        .patch(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      //make sure this is base monitor url
      const deleteMonitorResp = await agent
        .delete(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(mockMonitor);

      expect(deleteMonitorResp.statusCode).toBe(200);

      //place this exactly here to create new connection
      await redisConfiguration.connection.connect();

      //make sure this is base queue url
      const removeQueueResp = await agent.delete(
        `${baseQueueUrl}${handleQueueUrl}`
      );

      expect(removeQueueResp.statusCode).toBe(200);

      const myQueue = await getQueue();

      const repeatableJobs = await myQueue.getRepeatableJobs();

      expect(repeatableJobs).toEqual([]);

      //at the end of all tests, the redis connection
      //is closed to prevent memory leaks
    });
  });
});

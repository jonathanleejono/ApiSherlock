import {
  baseApiUrl,
  baseAuthUrl,
  baseMonitorUrl,
  baseQueueUrl,
  baseSeedDbUrl,
  getAllApisUrl,
  handleMonitorUrl,
  handleQueueUrl,
  loginUserUrl,
  seedMockApisDbUrl,
  seedMockUsersDbUrl,
} from "constants/apiUrls";
import { deleteMonitorSuccessMsg } from "constants/messages";
import { validMonitorDateDayOfWeekOptions } from "constants/options/monitor";
import {
  getQueue,
  getQueueScheduler,
  getQueueWorker,
  jobBaseName,
} from "constants/queue";
import { redisConfiguration } from "controllers/queueController";
import {
  MonitorDateAMOrPMOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { mockMonitor } from "mocks/mockMonitor";
import { mockUser } from "mocks/mockUser";
import { Monitor } from "models/MonitorDocument";
import mongoose, { Schema } from "mongoose";
import app from "server";
import request, { agent as supertest } from "supertest";
import { createDbUrl } from "test/dbUrl";
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

    let url = `mongodb://127.0.0.1/${databaseName}`;

    if (process.env.USING_CI === "yes") {
      url = createDbUrl(databaseName);
    }

    try {
      console.log("Connecting to MongoDB with url --------> ", url);
      await mongoose.connect(url);
    } catch (error) {
      console.log("Error connecting to MongoDB/Mongoose: ", error);
      return error;
    }

    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);
    const response = await request(app)
      .post(`${baseAuthUrl}${loginUserUrl}`)
      .send({
        email: mockUser.email,
        password: mockUser.password,
      });
    const { accessToken } = response.body;

    // this checks if the user's id is in auth headers
    // if it isn't, tests won't run and error is thrown
    currentUserId = await getCurrentUserId(accessToken);

    if (!currentUserId) {
      console.error("Couldn't get current user id");
      return;
    }

    const cookie = response.header["set-cookie"];
    await agent.auth(accessToken, { type: "bearer" }).set("Cookie", cookie);

    await agent.post(`${baseSeedDbUrl}${seedMockApisDbUrl}`);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();

    //all of this is to prevent memory leaks
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();

    //this all has to be here in this exact order
    //this is to close connections to prevent memory leaks
    const queueScheduler = await getQueueScheduler();
    await queueScheduler.close();
    const myQueue = await getQueue();
    await myQueue.obliterate();
    await myQueue.close();
    const worker = await getQueueWorker();
    await worker.close();
    await worker.disconnect();

    //this needs to be here to wait for connections to properly close
    await new Promise((res) => setTimeout(res, 4500));

    //this should say "end"
    console.log("Redis connection: ", redisConfiguration.connection.status);
  }, 10000);

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

      //this all has to be here in this exact order
      const queueScheduler = await getQueueScheduler();
      await queueScheduler.close();
      await myQueue.obliterate();
      await myQueue.close();
      const worker = await getQueueWorker();
      await worker.close();
      await worker.disconnect();

      //give time for connection to close properly, and prevent memory leaks
      await new Promise((res) => setTimeout(res, 2000));

      console.log(
        "Start Queue Redis connection: ",
        redisConfiguration.connection.status
      );
    });

    it("should ping monitored apis in queue", async (): Promise<void> => {
      const currentHour = new Date().getHours();

      const hour = currentHour > 12 ? currentHour - 12 : currentHour;

      const updates = {
        scheduleType: MonitorScheduleTypeOptions.DATE,
        dateDayOfWeek: validMonitorDateDayOfWeekOptions[new Date().getDay()],
        dateHour: hour,
        dateAMOrPM:
          //the current hour could be 12PM
          currentHour > 12 || currentHour === 12
            ? MonitorDateAMOrPMOptions.PM
            : MonitorDateAMOrPMOptions.AM,
        dateMinute: new Date().getMinutes(),
      };

      // first, update monitor to current time (with new settings above)
      const updateMonitorResp = await agent
        .patch(`${baseMonitorUrl}${handleMonitorUrl}`)
        .send(updates);

      expect(updateMonitorResp.statusCode).toBe(200);

      //place this exactly here to prevent memory leaks
      await redisConfiguration.connection.connect();

      // give time for connection to open
      await new Promise((res) => setTimeout(res, 1200));

      const startQueueResp = await agent.post(
        `${baseQueueUrl}${handleQueueUrl}`
      );

      expect(startQueueResp.statusCode).toBe(200);

      // give 3 seconds (3000 milliseconds) for database to update
      await new Promise((res) => setTimeout(res, 3000));

      const getAllApisResp = await agent.get(`${baseApiUrl}${getAllApisUrl}`);

      //adjusting the time to match the user's timezone
      const currentDateTime =
        Date.now() +
        new Date().getTimezoneOffset() * 1000 * 60 +
        1000 * 60 * 60 * mockUser.timezoneGMT;

      const formattedDateTime = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(currentDateTime);

      expect(getAllApisResp.body.allApis[0].lastPinged).toContain(
        `${formattedDateTime},`
      );

      expect(getAllApisResp.body.allApis[0].lastPinged).toContain(
        `(GMT ${mockUser.timezoneGMT})`
      );

      //this all has to be here in this exact order
      const queueScheduler = await getQueueScheduler();
      await queueScheduler.close();
      const myQueue = await getQueue();
      await myQueue.obliterate();
      await myQueue.close();
      const worker = await getQueueWorker();
      await worker.close();
      await worker.disconnect();

      //give time for connection to close properly, and prevent memory leaks
      await new Promise((res) => setTimeout(res, 2000));

      console.log(
        "Ping Queue Test Redis connection: ",
        redisConfiguration.connection.status
      );

      //10 sec timeout to prevent test from stopping as database connections are updating
    }, 10000);

    it("should remove monitor and jobs from queue", async (): Promise<void> => {
      mockMonitor.monitorSetting = MonitorSettingOptions.OFF;

      //have to turn off monitor first
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
      console.log(
        "Remove Queue Redis connection: ",
        redisConfiguration.connection.status
        //this status is going to say "ready",
        //but gets closed in the "afterAll" code
        //optionally you can close the connection here
      );
    });
  });
});

import {
  baseApiUrl,
  baseAuthUrl,
  baseSeedDbUrl,
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  getAllApisStatsUrl,
  getAllApisUrl,
  getApiUrl,
  loginUserUrl,
  pingAllApisUrl,
  pingOneApiUrl,
  seedMockApisDbUrl,
  seedMockUsersDbUrl,
} from "constants/apiUrls";
import {
  deleteApiSuccessMsg,
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import closeMongoose from "db/closeMongoose";
import connectMongoose from "db/connectMongoose";
import { ApiMonitoringOptions } from "enum/apis";
import { mockApi } from "mocks/mockApi";
import { mockApis } from "mocks/mockApis";
import { mockApisStats } from "mocks/mockApisStats";
import { editMockApiUrl, mockUpdatedApis } from "mocks/mockUpdatedApis";
import { mockUser } from "mocks/mockUser";
import { Api } from "models/ApiDocument";
import mongoose, { Schema } from "mongoose";
import app from "server";
import request, { agent as supertest } from "supertest";
import { createDbUrl } from "test/dbUrl";

const agent = supertest(app);

let currentUserId: Schema.Types.ObjectId;
let apiObjId: Schema.Types.ObjectId; // using this apiObjId for patch and ping one
let apiToDeleteId: Schema.Types.ObjectId;

const mockUpdatedApi = mockUpdatedApis[0];

const mockQueryParamApi = mockApis[1];

const testApiResponse: Api = {
  url: expect.any(String),
  host: expect.any(String),
  monitoring: expect.any(String),
  status: expect.any(String),
  lastPinged: expect.any(String),
  createdBy: expect.any(String),
  _id: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  __v: expect.any(Number),
};

const databaseName = "test-apis";

let url = `mongodb://127.0.0.1/${databaseName}`;

if (process.env.USING_CI === "yes") {
  url = createDbUrl(databaseName);
}

describe("testing api controller", () => {
  beforeAll(async () => {
    await connectMongoose(url);

    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);

    const response = await request(app)
      .post(`${baseAuthUrl}${loginUserUrl}`)
      .send({
        email: mockUser.email,
        password: mockUser.password,
      });

    currentUserId = response.body.user.id;

    if (!currentUserId) {
      console.error("Couldn't get current user id");
      return;
    }

    const cookie = response.header["set-cookie"];
    await agent.set("Cookie", cookie);

    await agent.post(`${baseSeedDbUrl}${seedMockApisDbUrl}`);
  });

  afterAll(async () => {
    //collections don't exist at the start,
    //so drop them in afterAll and not beforeAll
    await mongoose.connection.db.dropDatabase();

    await closeMongoose();
  }, 10000);

  describe("testing apis", () => {
    it("should get all APIs", async (): Promise<void> => {
      const response = await agent.get(`${baseApiUrl}${getAllApisUrl}`);

      //reversed because in apiController, the array is sorted
      //descending by _id, meaning apis are sorted by latest
      const responseAllApis = response.body.allApis.reverse();

      //make sure this aligns with the "update API" test
      apiObjId = responseAllApis[0]._id;

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(responseAllApis).toMatchObject(mockApis);
      expect(response.body.totalApis).toEqual(mockApis.length);
      expect(response.body.numOfPages).toEqual(Math.ceil(mockApis.length / 10));
    });

    it("should get all APIs with query params", async (): Promise<void> => {
      const response = await agent.get(
        `${baseApiUrl}${getAllApisUrl}/?monitoring=${ApiMonitoringOptions.OFF}`
      );

      testApiResponse.url = mockQueryParamApi.url;
      testApiResponse.host = mockQueryParamApi.host;
      testApiResponse.monitoring = mockQueryParamApi.monitoring;
      testApiResponse.createdBy = currentUserId;

      expect(response.statusCode).toBe(200);
      // testApiResponse needs to be an array
      // because allApis outputs an array
      expect(response.body.allApis).toMatchObject([testApiResponse]);
      expect(response.body.totalApis).toEqual(1);
      expect(response.body.numOfPages).toEqual(Math.ceil(1));
    });

    it("should create an api object", async (): Promise<void> => {
      const response = await agent
        .post(`${baseApiUrl}${createApiUrl}`)
        .send(mockApi);

      testApiResponse.url = mockApi.url;
      testApiResponse.host = mockApi.host;
      testApiResponse.monitoring = mockApi.monitoring;

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(testApiResponse));
      apiToDeleteId = response.body._id;
    });

    it("should update an api object", async (): Promise<void> => {
      const updatedData = {
        url: editMockApiUrl,
      };
      const response = await agent
        .patch(`${baseApiUrl}${editApiUrl}/${apiObjId}`)
        .send({
          url: updatedData.url,
        });

      testApiResponse._id = apiObjId;
      testApiResponse.url = updatedData.url;
      testApiResponse.host = mockApi.host;
      testApiResponse.monitoring = mockApi.monitoring;

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(testApiResponse));
    });

    it("should delete an api object", async (): Promise<void> => {
      const response = await agent.delete(
        `${baseApiUrl}${deleteApiUrl}/${apiToDeleteId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining(deleteApiSuccessMsg)
      );
    });

    it("should show stats of all apis", async (): Promise<void> => {
      const response = await agent.get(`${baseApiUrl}${getAllApisStatsUrl}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(mockApisStats));
    });

    describe("testing the pinging of APIs", () => {
      it("should ping api", async (): Promise<void> => {
        const pingResponse = await agent.post(
          `${baseApiUrl}${pingOneApiUrl}/${apiObjId}`
        );

        expect(pingResponse.statusCode).toBe(200);
        expect(pingResponse.body).toEqual(pingOneApiSuccessMsg);

        const response = await agent.get(
          `${baseApiUrl}${getApiUrl}/${apiObjId}`
        );

        // re-initialize _id because _id is altered in previous test
        testApiResponse._id = expect.any(String);
        testApiResponse.url = mockUpdatedApi.url;
        testApiResponse.status = mockUpdatedApi.status;
        testApiResponse.monitoring = mockUpdatedApi.monitoring;
        testApiResponse.createdBy = currentUserId;

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(testApiResponse));
      });

      it("should ping all apis", async (): Promise<void> => {
        const pingResponse = await agent.post(`${baseApiUrl}${pingAllApisUrl}`);

        // give 4 seconds for database to update
        await new Promise((res) => setTimeout(res, 4000));

        const response = await agent.get(`${baseApiUrl}${getAllApisUrl}`);

        expect(pingResponse.statusCode).toBe(200);
        expect(pingResponse.body).toEqual(pingAllApisSuccessMsg);
        expect(response.statusCode).toBe(200);

        //don't forget to reverse allApis
        expect(response.body.allApis.reverse()).toMatchObject(mockUpdatedApis);
      }, 10000);
    });

    describe("testing auth for api routes", () => {
      it("should throw unauthenticated error with wrong token", async (): Promise<void> => {
        const response = await agent
          .get(`${baseApiUrl}${getAllApisUrl}`)
          .set("Cookie", `STALE_COOKIE`);
        expect(response.statusCode).toBe(401);
      });
    });
  });
});

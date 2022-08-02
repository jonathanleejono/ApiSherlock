import {
  deleteApiSuccessMsg,
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
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
  resetMockApisDbUrl,
  resetMockUsersDbUrl,
  seedMockApisDbUrl,
  seedMockUsersDbUrl,
} from "constants/urls";
import getCurrentUserId from "middleware/getCurrentUserId";
import { mockApi } from "mocks/mockApi";
import { mockApis } from "mocks/mockApis";
import { mockApisStats } from "mocks/mockApisStats";
import { mockUpdatedApis } from "mocks/mockUpdatedApis";
import { mockUser } from "mocks/mockUser";
import mongoose from "mongoose";
import app from "server";
import request, { agent as supertest } from "supertest";

const agent = supertest(app);

let currentUserId: string | { error: any } = "";
let apiObjId: string; // using this apiObjId for patch and ping one
let apiToDeleteId: string;

const mockUpdatedApi = mockUpdatedApis[0];

const mockQueryParamApi = mockApis[1];

let testApiResponse = {
  url: "",
  host: "",
  monitoring: "",
  status: expect.any(String),
  lastPinged: expect.any(String),
  createdBy: "",
  _id: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  __v: expect.any(Number),
};

describe("testing api controller", () => {
  beforeAll(async () => {
    await request(app).delete(`${baseSeedDbUrl}${resetMockUsersDbUrl}`);
    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);
    const response = await request(app)
      .post(`${baseAuthUrl}${loginUserUrl}`)
      .send({
        email: mockUser.email,
        password: mockUser.password,
      });
    const { token } = response.body;
    currentUserId = await getCurrentUserId(token);
    await agent.auth(token, { type: "bearer" });
    await agent.delete(`${baseSeedDbUrl}${resetMockApisDbUrl}`);
    await agent.post(`${baseSeedDbUrl}${seedMockApisDbUrl}`);
  });

  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });

  describe("testing apis", () => {
    it("should get all APIs", async (): Promise<void> => {
      const response = await agent.get(`${baseApiUrl}${getAllApisUrl}`);

      apiObjId = response.body.allApis[0]._id;

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.body.allApis).toMatchObject(mockApis);
      expect(response.body.totalApis).toEqual(mockApis.length);
      expect(response.body.numOfPages).toEqual(Math.ceil(mockApis.length / 10));
    });

    it("should get all APIs with query params", async (): Promise<void> => {
      const response = await agent.get(
        `${baseApiUrl}${getAllApisUrl}/?monitoring=off`
      );

      testApiResponse.url = mockQueryParamApi.url;
      testApiResponse.host = mockQueryParamApi.host;
      testApiResponse.monitoring = mockQueryParamApi.monitoring;
      testApiResponse.createdBy = currentUserId as string;

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
        url: "https://battery-cellify.herokuapp22.com/ping",
      };
      const response = await agent
        .patch(`${baseApiUrl}${editApiUrl}/${apiObjId}`)
        .send({
          url: updatedData.url,
        });

      testApiResponse._id = `${apiObjId}`;
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

    it("should throw unauthenticated error with wrong token", async (): Promise<void> => {
      const response = await agent
        .get(`${baseApiUrl}${getAllApisUrl}`)
        .set("Authorization", `Bearer INVALID_TOKEN`);
      expect(response.statusCode).toBe(401);
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
        testApiResponse.createdBy = `${currentUserId}`;

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(testApiResponse));
      });

      it("should ping all apis", async (): Promise<void> => {
        const pingResponse = await agent.post(`${baseApiUrl}${pingAllApisUrl}`);

        // give 3 seconds (3000 milliseconds) for database to update
        await new Promise((res) => setTimeout(res, 3000));

        const response = await agent.get(`${baseApiUrl}${getAllApisUrl}`);

        expect(pingResponse.statusCode).toBe(200);
        expect(pingResponse.body).toEqual(pingAllApisSuccessMsg);
        expect(response.statusCode).toBe(200);
        expect(response.body.allApis).toMatchObject(mockUpdatedApis);
      }, 30000);
    });
  });
});

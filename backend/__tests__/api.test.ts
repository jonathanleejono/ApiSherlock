import mongoose from "mongoose";
import request, { agent as supertest } from "supertest";
import { deleteMsg } from "../controllers/apiController";
import getCurrentUserId from "../middleware/getCurrentUserId";
import { mockApi } from "../mocks/mockApi";
import { mockApis } from "../mocks/mockApis";
import { mockUpdatedApis } from "../mocks/mockUpdatedApis";
import { mockUser } from "../mocks/mockUser";
import app from "../server";

const apiAuthUrl = "/api/auth";
const apiApiUrl = "/api/api";
const seedDbUrl = "/api/db";

const agent = supertest(app);

let currentUserId;
// using this api for patch and ping one
let apiObjId;
let apiToDelete;

const mockUpdatedApi = mockUpdatedApis[0];

describe("testing api controller", () => {
  beforeAll(async () => {
    await request(app).delete(`${seedDbUrl}/resetDb/users`);
    await request(app).post(`${seedDbUrl}/seedDb/users`);
    const response = await request(app).post(`${apiAuthUrl}/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });
    const token = response.body.token;
    currentUserId = await getCurrentUserId(token);
    await agent.auth(token, { type: "bearer" });
    await agent.delete(`${seedDbUrl}/resetDb/api`);
    await agent.post(`${seedDbUrl}/seedDb/api`);
  });

  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });

  describe("testing apis", () => {
    // use more describe blocks to add separate GET, POST, PATCH, DELETE exception testing
    it("should get APIs", async (): Promise<void> => {
      const response = await agent.get(`${apiApiUrl}`);

      // this has to come before expect statements
      apiObjId = response.body.allApis[0]._id;

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.body.allApis).toMatchObject(mockApis);
      expect(response.body.totalApis).toEqual(mockApis.length);
      expect(response.body.numOfPages).toEqual(Math.ceil(mockApis.length / 10));
    });

    it("should create an api object", async (): Promise<void> => {
      const response = await agent.post(`${apiApiUrl}`).send(mockApi);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          api: {
            url: mockApi.url,
            host: mockApi.host,
            status: mockApi.status,
            lastPinged: mockApi.lastPinged,
            monitoring: mockApi.monitoring,
            createdBy: `${currentUserId}`,
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number),
          },
        })
      );
      apiToDelete = response.body.api._id;
    });

    it("should update an api object", async (): Promise<void> => {
      const updatedData = {
        url: "https://battery-cellify.herokuapp22.com/ping",
      };
      const response = await agent.patch(`${apiApiUrl}/${apiObjId}`).send({
        url: updatedData.url,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          // order of the keys matter in test result
          _id: `${apiObjId}`,
          url: updatedData.url,
          host: mockApi.host,
          status: mockApi.status,
          lastPinged: mockApi.lastPinged,
          monitoring: mockApi.monitoring,
          createdBy: `${currentUserId}`,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        })
      );
    });

    it("should delete an api object", async (): Promise<void> => {
      const response = await agent.delete(`${apiApiUrl}/${apiToDelete}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ msg: deleteMsg })
      );
    });

    describe("testing the pinging of APIs", () => {
      it("should ping api", async (): Promise<void> => {
        const pingResponse = await agent.post(
          `${apiApiUrl}/ping-one/${apiObjId}`
        );

        expect(pingResponse.statusCode).toBe(200);
        expect(pingResponse.body).toEqual("Pinged API");

        const response = await agent.get(`${apiApiUrl}/${apiObjId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            //  make sure to *not* include api:{} as outer structure
            _id: expect.any(String),
            url: mockUpdatedApi.url,
            host: mockUpdatedApi.host,
            status: mockUpdatedApi.status,
            lastPinged: expect.any(String),
            monitoring: mockUpdatedApi.monitoring,
            createdBy: `${currentUserId}`,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number),
          })
        );
      });

      it("should ping all apis", async (): Promise<void> => {
        const pingResponse = await agent.post(`${apiApiUrl}/ping-all`);

        // give 3 seconds (3000 milliseconds) for database to update
        await new Promise((res) => setTimeout(res, 3000));

        const response = await agent.get(`${apiApiUrl}`);

        expect(pingResponse.statusCode).toBe(200);
        // maybe make a constant for the returned message eg. const pingAllMsg = "Pinged APIs"
        expect(pingResponse.body).toEqual("Pinged APIs");

        expect(response.statusCode).toBe(200);

        expect(response.body.allApis).toMatchObject(mockUpdatedApis);
      }, 30000);
    });
  });
});

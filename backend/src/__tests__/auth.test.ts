import { cookieName } from "constants/cookies";
import {
  baseAuthUrl,
  baseSeedDbUrl,
  loginUserUrl,
  registerUserUrl,
  resetMockUsersDbUrl,
  seedMockUsersDbUrl,
  updateUserUrl,
} from "constants/urls";
import { mockUser } from "mocks/mockUser";
import { User } from "models/UserDocument";
import mongoose from "mongoose";
import app from "server";
import request from "supertest";

const user: Partial<User> = {
  name: "jane",
  email: "janedoe2@gmail.com",
  password: "password",
  timezoneGMT: -5,
};

const { name, email, password, timezoneGMT } = user;

describe("testing users controller", () => {
  beforeAll(async () => {
    await request(app).delete(`${baseSeedDbUrl}${resetMockUsersDbUrl}`);
    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);
  });

  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });

  describe("given a user's name, email, and password", () => {
    it("should create a user", async (): Promise<void> => {
      const response = await request(app)
        .post(`${baseAuthUrl}${registerUserUrl}`)
        .send({
          name: name,
          email: email,
          password: password,
          timezoneGMT: timezoneGMT,
        });

      expect(response.statusCode).toBe(201);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          user: { name, email, timezoneGMT },
        })
      );
    });

    it("should login a user", async (): Promise<void> => {
      // this is the mock user in the "mocks" folder
      const response = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          user: {
            name: mockUser.name,
            email: mockUser.email,
            timezoneGMT: mockUser.timezoneGMT,
          },
        })
      );
    });

    it("should update a user", async (): Promise<void> => {
      const loginResponse = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      const { accessToken } = loginResponse.body;

      const response = await request(app)
        .patch(`${baseAuthUrl}${updateUserUrl}`)
        .send({
          name: "bob",
          email: mockUser.email,
          timezoneGMT: mockUser.timezoneGMT,
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", loginResponse.header["set-cookie"]);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          user: {
            name: "bob",
            email: mockUser.email,
            timezoneGMT: mockUser.timezoneGMT,
          },
        })
      );
    });

    it("should give unauthenticated response for wrong password", async (): Promise<void> => {
      const loginResponse = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: mockUser.email,
          password: "Incorrect password",
        });

      expect(loginResponse.statusCode).toBe(401);
    });
  });

  describe("testing cookies", () => {
    it("should show cookies in header", async () => {
      const loginResponse = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      const cookieHeader = loginResponse.headers["set-cookie"];

      expect(loginResponse.statusCode).toBe(200);
      expect(cookieHeader).toBeTruthy();

      const cookie = cookieHeader[0];

      expect(cookie).toContain(cookieName);
    });
  });
});

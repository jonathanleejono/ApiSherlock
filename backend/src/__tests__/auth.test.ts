import {
  authUserUrl,
  baseAuthUrl,
  baseSeedDbUrl,
  loginUserUrl,
  registerUserUrl,
  seedMockUsersDbUrl,
} from "constants/apiUrls";
import { cookieName } from "constants/cookies";
import closeMongoose from "db/closeMongoose";
import connectMongoose from "db/connectMongoose";
import { mockUser } from "mocks/mockUser";
import { User } from "models/UserDocument";
import mongoose from "mongoose";
import app from "server";
import request from "supertest";
import { createDbUrl } from "test/dbUrl";

const user: Omit<User, "_id"> = {
  name: "jane",
  email: "janedoe2@gmail.com",
  password: "password",
  timezoneGMT: -5,
};

const databaseName = "test-users";

let url = `mongodb://127.0.0.1/${databaseName}`;

if (process.env.USING_CI === "yes") {
  url = createDbUrl(databaseName);
}

describe("testing users controller", () => {
  beforeAll(async () => {
    await connectMongoose(url);

    await request(app).post(`${baseSeedDbUrl}${seedMockUsersDbUrl}`);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();

    await closeMongoose();
  });

  describe("given a user's name, email, and password", () => {
    it("should create a user", async (): Promise<void> => {
      const response = await request(app)
        .post(`${baseAuthUrl}${registerUserUrl}`)
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
          timezoneGMT: user.timezoneGMT,
        });

      expect(response.statusCode).toBe(201);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          user: {
            id: expect.any(String),
            name: user.name,
            email: user.email,
            timezoneGMT: user.timezoneGMT,
          },
          accessToken: expect.any(String),
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
          user: {
            id: expect.any(String),
            name: mockUser.name,
            email: mockUser.email,
            timezoneGMT: mockUser.timezoneGMT,
          },
          accessToken: expect.any(String),
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

      const response = await request(app)
        .patch(`${baseAuthUrl}${authUserUrl}`)
        .send({
          name: "bob",
          email: mockUser.email,
          timezoneGMT: mockUser.timezoneGMT,
        })
        .set("Cookie", loginResponse.header["set-cookie"]);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          user: {
            id: expect.any(String),
            name: "bob",
            email: mockUser.email,
            timezoneGMT: mockUser.timezoneGMT,
          },
          accessToken: expect.any(String),
        })
      );
    });

    it("should get a user", async (): Promise<void> => {
      const loginResponse = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: user.email,
          password: user.password,
        });

      const response = await request(app)
        .get(`${baseAuthUrl}${authUserUrl}`)
        .set("Cookie", loginResponse.header["set-cookie"]);

      expect(response.statusCode).toBe(200);

      // make sure there's no outer user key
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: user.name,
          email: user.email,
          timezoneGMT: user.timezoneGMT,
        })
      );
    });

    it("should give unauthorized response for wrong password", async (): Promise<void> => {
      const loginResponse = await request(app)
        .post(`${baseAuthUrl}${loginUserUrl}`)
        .send({
          email: mockUser.email,
          password: "Incorrect password",
        });

      expect(loginResponse.statusCode).toBe(401);
    });
  });

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

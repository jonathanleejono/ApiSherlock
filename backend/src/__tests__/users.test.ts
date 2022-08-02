import mongoose from "mongoose";
import request from "supertest";
import { mockUser } from "mocks/mockUser";
import app from "server";
import {
  baseAuthUrl,
  baseSeedDbUrl,
  loginUserUrl,
  registerUserUrl,
  resetMockUsersDbUrl,
  seedMockUsersDbUrl,
  updateUserUrl,
} from "constants/urls";

const user = {
  name: "jane",
  email: "janedoe2@gmail.com",
  password: "password",
};

const { name, email, password } = user;

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
          name,
          email,
          password,
        });

      expect(response.statusCode).toBe(201);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: { name: name, email: email },
        })
      );

      // expect.objectContaining will fail because email is missing
      //   expect(response.body).toEqual(
      //     expect.objectContaining({ user: { name: name } })
      //   );
      //   toMatchObject won't fail even though email is missing
      //   expect(response.body).toMatchObject({
      //     user: { name: name },
      //   });
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
          token: expect.any(String),
          user: { name: mockUser.name, email: mockUser.email },
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

      const { token } = loginResponse.body;

      const response = await request(app)
        .patch(`${baseAuthUrl}${updateUserUrl}`)
        .send({
          name: "bob",
          email: mockUser.email,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: { name: "bob", email: mockUser.email },
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
});

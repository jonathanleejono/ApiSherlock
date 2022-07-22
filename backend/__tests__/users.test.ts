import request from "supertest";
import { seedUser } from "../db/seedDb";
import app from "../server";
import mongoose from "mongoose";

const apiAuthUrl = "/api/auth";
const seedDbUrl = "/api/db";

const user = {
  name: "jane",
  email: "janedoe2@gmail.com",
  password: "password",
};

const { name, email, password } = user;

describe("testing users controller", () => {
  beforeEach(async () => {
    await request(app).delete(`${seedDbUrl}/resetDb`);
    await request(app).post(`${seedDbUrl}/seedDb`);
  });

  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });

  describe("given a user's name, email, and password", () => {
    it("should create a user", async (): Promise<void> => {
      const response = await request(app).post(`${apiAuthUrl}/register`).send({
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
      //   toMatchObject won't fail because it doesn't mind missing key value pairs
      //   expect(response.body).toMatchObject({
      //     user: { name: name },
      //   });
    });

    it("should login a user", async (): Promise<void> => {
      // this is the user in the seedDb route (in the db folder)
      const response = await request(app).post(`${apiAuthUrl}/login`).send({
        email: seedUser.email,
        password: seedUser.password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: { name: seedUser.name, email: seedUser.email },
        })
      );
    });

    it("should update a user", async (): Promise<void> => {
      // perhaps should make a constants folder with api urls
      const loginResponse = await request(app)
        .post(`${apiAuthUrl}/login`)
        .send({
          email: seedUser.email,
          password: seedUser.password,
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .patch(`${apiAuthUrl}/updateUser`)
        .send({
          name: "bob",
          email: seedUser.email,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: { name: "bob", email: seedUser.email },
        })
      );
    });
    // more tests: missing values in fields, invalid credentials (eg. wrong password)
  });
});

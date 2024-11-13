import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../src/server/server.ts";

describe("packages endpoint", () => {
  it("valid response format", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Name": "name1",
            "Version": "version1"
          },
          {
            "Name": "name2",
            "Version": "version2"
          }
        ]
      );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      [
        {
          "Name": "name1",
          "Version": "version1",
          "ID": "dummyid"
        },
        {
          "Name": "name2",
          "Version": "version2",
          "ID": "dummyid"
        }
      ]
    );
  });

  it("Name key 0 invalid", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Nam": "name1",
            "Version": "version1"
          },
          {
            "Name": "name2",
            "Version": "version2"
          }
        ]
      );
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({});
  });

  it("Version key 0 invalid", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Name": "name1",
            "Verson": "version1"
          },
          {
            "Name": "name2",
            "Version": "version2"
          }
        ]
      );
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({});
  });

  it("Name key 1 invalid", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Name": "name1",
            "Version": "version1"
          },
          {
            "Nam": "name2",
            "Version": "version2"
          }
        ]
      );
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({});
  });

  it("Version key 1 invalid", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Name": "name1",
            "Verson": "version1"
          },
          {
            "Name": "name2",
            "Verson": "version2"
          }
        ]
      );
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({});
  });

  // Current maximum packages that can requested at once is 2
  it("1 too many packages", async () => {
    const response = await request(app)
      .post("/packages?offset=20")
      .send(
        [
          {
            "Name": "name1",
            "Version": "version1"
          },
          {
            "Name": "name2",
            "Version": "version2"
          },
          {
            "Name": "name3",
            "Version": "version4"
          }
        ]
      );
    expect(response.statusCode).toEqual(413);
    expect(response.body).toEqual({});
  });

});

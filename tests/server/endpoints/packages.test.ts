import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../src/server/server.ts";

describe("packages endpoint", () => {
  it("POST /packages?offset=20 should say not implemented and the offset", async () => {
    const res = await request(app)
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
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
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
    //expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get packages");
    //expect(res.body).toHaveProperty("offset", "20");
  });
});

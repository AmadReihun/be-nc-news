const request = require("supertest");
const { app } = require("../app/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
require("jest-sorted");
const fs = require("fs/promises")
const endpoint = require("../endpoints.json")


afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("app", () => {
  describe("/api", () => {
    describe("GET /topics", () => {
      test("Responds with a status of 200 for the right request.", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("200 - Responds with an array of topics to the client.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = body.topics;
            // console.log(body);
            expect(Object.keys(topics[0]).length).toBe(2);
            expect(topics).toHaveLength(3);
            // Checking the data type
            topics.forEach((topic) => {
              expect(typeof topic.slug).toBe("string");
              expect(typeof topic.description).toBe("string");
            });
          });
      });
      test("to get error 404 if the path is wrong", () => {
        return request(app)
          .get("/api/wrongpath")
          .expect(404)
      })
    });
  });

  describe("GET /api to show the endpoint", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api").expect(200);
    });
    test("200 - Responds with an array of topics to the client.", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {

          expect(typeof(body.endpoint)).toBe('object');

          // // Checking the data type

          for (const [key, value] of Object.entries(body.endpoint)) {
            expect(typeof(key)).toBe('string');
            expect(typeof(value)).toBe('object');
          }

          // check if the returned body is similar to the JSON file

          fs.readFile("/home/amad7/northcoders/backend/be-nc-news/endpoints.json", "utf-8")
          .then((fileContents) => {
          const paredEndpoint = JSON.parse(fileContents);
          
          expect(paredEndpoint).toEqual(body.endpoint)
  })
        });
    });
    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .get("/wrongpath")
        .expect(404)
    })
  });
}); 
const request = require("supertest");
const { app } = require("../app/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
require("jest-sorted");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("app", () => {
  describe("/api", () => {
    describe("GET /topics", () => {
      test("Responds with a status of 200.", () => {
        expect('hello').toBe('hello')
      });
      
    });
  });
}); 
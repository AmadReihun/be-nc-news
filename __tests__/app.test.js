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

  describe("GET /api/articles", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200 - Responds with an array of topics to the client.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const articles = body.article;
          expect(Object.keys(articles[0]).length).toBe(8);
          expect(articles).toHaveLength(1);
          // Checking the data type
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.body).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
          });
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .get("/api/wrongpath/1")
        .expect(404)
    });

    test("to get error 404 and respond with appropriate message when given valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 400 and respond with appropriate message when given invalid and bad type article_id", () => {
      return request(app)
        .get("/api/articles/apple")
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });
  });
}); 
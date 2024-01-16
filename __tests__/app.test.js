const request = require("supertest");
const { app } = require("../app/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
require("jest-sorted");
const fs = require("fs/promises")
const JSONendpoint = require("../endpoints.json");
const articles = require("../db/data/test-data/articles.js");


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
    test("200 - Responds with an array of endpoints to the client.", () => {
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
          
          expect(JSONendpoint).toEqual(body.endpoint)
        
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .get("/wrongpath")
        .expect(404)
    })
  });

  describe("GET /api/articles/:article_id", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200 - Responds with the requested article_id to the client.", () => {
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
          // Checking the accuracy of the data for article_id 1
          expect(articles[0].article_id).toBe(1);
          expect(articles[0].title).toBe('Living in the shadow of a great man');
          expect(articles[0].topic).toBe('mitch');
          expect(articles[0].author).toBe('butter_bridge');
          expect(articles[0].body).toBe('I find this existence challenging');
          expect(articles[0].created_at).toBe('2020-07-09T20:11:00.000Z');
          expect(articles[0].votes).toBe(100);
          expect(articles[0].article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
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

  describe("GET /api/articles", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/articles").expect(200);
    });

    test("200 - Responds with an array of all articles to the client.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.article;

          expect(Object.keys(articles[0]).length).toBe(8);
          
          // Checking the data types && not to have body property
          
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.count).toBe("string");
            expect(typeof article.body).toBe("undefined");
          });

          // Checking that the articles are sorted by date in descending order

          for (let i = 0; i < articles.length-1; i++) {
          expect(articles[i+1].created_at <= articles[i].created_at).toBe(true)
          }
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .get("/api/wrongpath")
        .expect(404)
    });
  });
}); 

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with a status of 200 for the right request.", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("200 - Responds with the requested article_id to the client.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.article;
        expect(Object.keys(comments[0]).length).toBe(6);
        expect(comments).toHaveLength(11);

        // Checking the data type

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });

        // Checking the accuracy of the data for article_id 1

        expect(comments[0].comment_id).toBe(5);
        expect(comments[0].body).toBe('I hate streaming noses');
        expect(comments[0].article_id).toBe(1);
        expect(comments[0].author).toBe('icellusedkars');
        expect(comments[0].votes).toBe(0);
        expect(comments[0].created_at).toBe('2020-11-03T21:00:00.000Z');

        // Checking that the comments are sorted by date in descending order

        expect(body.article).toBeSortedBy('created_at', {descending: true})
        
      }); 
  });

  test("to get error 404 if the path is wrong", () => {
    return request(app)
      .get("/api/wrongpath/1/comments")
      .expect(404)
    
  });

  test("to get error 404 and respond with appropriate message when given valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({body}) => {
        const message = body.msg;
        expect(message).toBe("Not Found")
      })
  });

  test("to get error 400 and respond with appropriate message when given invalid and bad type article_id", () => {
    return request(app)
      .get("/api/articles/apple/comments")
      .expect(400)
      .then(({body}) => {
        const message = body.msg;
        expect(message).toBe("Bad Request")
      })
  });
});
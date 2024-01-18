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
            expect(typeof article.comment_count).toBe("string");
            expect(typeof article.body).toBe("undefined");
          });

          // Checking that the articles are sorted by date in descending order

            expect(body.article).toBeSortedBy('created_at', {descending: true})
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .get("/api/wrongpath")
        .expect(404)
    });

    test("200 - can filter articles by given topic query.", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const articles = body.article;
          
          expect(articles.length).toBe(12);

          expect(Object.keys(articles[0]).length).toBe(8);
          
          // Checking to have just the mitch articles after query
          
          articles.forEach((article) => {
            
          expect(article.topic).toBe("mitch");
          });

          // Checking that the articles are sorted by date in descending order

            expect(body.article).toBeSortedBy('created_at', {descending: true})
        });
    });

    test("to get error 404 and respond with appropriate message when given valid but non-existent topic", () => {
      return request(app)
      .get("/api/articles?topic=james")
      .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("topic not found")
        })
    });

    test("200 - to give an empty array when topic exists in topics but does not have any article yet e.g paper", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const articles = body.article;
          expect(articles.length).toBe(0);
          
        });
    });

  });


  describe("GET /api/articles/:article_id/comments", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });

    test("200 - Responds with the comment that belongs to the requested article_id.", () => {
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

            // to check if all belongs to id 1
            
            expect(comment.article_id).toBe(1)
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

    test("200 - Responds with empty array when there is no comment for that id but id exists e.g id 2.", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          
          const comments = body.article;

          expect(comments.length).toBe(0);
          
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
          expect(message).toBe("article_id not found")
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

  describe("POST /api/articles/:article_id/comments", () => {
    
    test("Responds with a status of 201 for the right request.", () => {
      return request(app).post("/api/articles/1/comments").send({
        username: 'butter_bridge',
        body: "new comment"
      })
        .expect(201);
    });

    test("returns newly created object", () => {
      return request(app).post("/api/articles/1/comments").send({
        username: 'butter_bridge',
        body: "new comment"
      })
        .expect(201)
        .then((response) => {
          const newComment = response.body.comment;

          expect(Object.keys(newComment).length).toBe(6)

          // checking the accuracy of the data

          expect(newComment.comment_id).toBe(19);
          expect(newComment.body).toBe("new comment");
          expect(newComment.article_id).toBe(1);
          expect(newComment.author).toBe('butter_bridge');
          expect(newComment.votes).toBe(0);
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .post("/api/wrongpath/1/comments")
        .expect(404)
    });
  
    test("to get error 404 and respond with appropriate message when given valid but non-existent article_id", () => {
      return request(app)
        .post("/api/articles/150/comments")
        .send({
          username: 'butter_bridge',
          body: "new comment"})
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 404 and respond with appropriate message when given valid but non-existent username input in users database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: 'whatever username',
          body: "new comment"})
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 400 and respond with appropriate message when given invalid and bad type article_id", () => {
      return request(app)
        .post("/api/articles/apple/comments")
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });

    test("to get error 404 and respond with appropriate message when given wrong type value e.g number instead of a string", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: 6,
        body: 'new comment' })
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 400 and respond with appropriate message when given wrong key name", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({
        usernameeeee: 'butter_bridge',
        body: "new comment"})
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
  
    test("status code: 200 and returns article with the updated votes when the vote input is positive", () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 300 })
      .expect(200)
        .then((response) => {

          expect(Object.keys(response.body).length).toBe(1);

          const {updatedArticle} = response.body;

          // to check the number of the properties

          expect(Object.keys(updatedArticle).length).toBe(8);

          // to check the accuracy of the updatedArticle data

          expect(updatedArticle.votes).toBe(400);
          expect(updatedArticle.article_id).toBe(1);
          expect(updatedArticle.title).toBe('Living in the shadow of a great man');
          expect(updatedArticle.topic).toBe('mitch');
          expect(updatedArticle.author).toBe('butter_bridge');
          expect(updatedArticle.body).toBe('I find this existence challenging');
          expect(updatedArticle.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(updatedArticle.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
        });
    });

    test("status code: 200 and returns article with the updated votes when the vote input is negative", () => {
      return request(app).patch('/api/articles/1')
      .send({ inc_votes: -50 })
      .expect(200)
        .then((response) => {
          expect(response.body.updatedArticle.votes).toBe(50);
        });
    });

    test("to get error 404 if the path is wrong", () => {
      return request(app)
        .patch('/api/wrongpath/1')
        .expect(404)
    });

    test("to get error 404 and respond with appropriate message when given valid but non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/150")
        .send({ inc_votes: 300 })
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 400 and respond with appropriate message when given invalid and bad type article_id", () => {
      return request(app)
      .patch("/api/articles/apple")
      .send({ inc_votes: 300 })
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });

    test("to get error 404 and respond with appropriate message when given empty input", () => {
      return request(app)
        .patch("/api/articles/150")
        .send({})
        .expect(404)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Not Found")
        })
    });

    test("to get error 400 and respond with appropriate message when not giving any input at all", () => {
      return request(app)
        .patch("/api/articles/1")
        
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });

    test("to get error 400 and respond with appropriate message when given wrong type value e.g string instead of a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 'hello'})
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });

    test("to get error 400 and respond with appropriate message when given wrong key name", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({votessss : 20})
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });
  });


  describe("DELETE /api/comments/:comment_id", () => {

    test("status code: 204 and no content message after deletion of existing comment id", () => {
      return request(app).delete('/api/comments/18').expect(204)
      .then((body) => {
        expect(body.res.statusMessage).toBe('No Content')
      })
    });

    test("returns 404 error when calling delete method twice on the same id", () => {
      return request(app).delete('/api/comments/18')
      .then(() => {
        return request(app).delete('/api/comments/18').expect(404)
        .then((body) => {
          expect(body.res.statusMessage).toBe('Not Found')
        })
      });
    });

    test("returns 404 and appropriate message after deletion of non-existing comment id", () => {
      return request(app).delete('/api/comments/20').expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe('Not Found')
      })
    });

    test("to get error 400 and respond with appropriate message when given invalid and bad type id", () => {
      return request(app)
      .delete('/api/comments/apple')
        .expect(400)
        .then(({body}) => {
          const message = body.msg;
          expect(message).toBe("Bad Request")
        })
    });
  });

  describe("GET /users", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/users").expect(200);
    });
    test("200 - Responds with an array of users to the client.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          
          const users = body.users;
          
          expect(users).toHaveLength(4);

          // Checking the data type

          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });

          // Checking the accuracy of the data for one of the users
          
            expect(users[0].username).toBe("butter_bridge");
            expect(users[0].name).toBe("jonny");
            expect(users[0].avatar_url).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg");

        });
    });
    
  });

  describe("GET /api/articles/:article_id for task 12 to add the Comment Count column", () => {
    test("Responds with a status of 200 for the right request.", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200 - Responds with the requested article_id to the client to include comment count.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const articles = body.article;

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

            // to check if comment count has been included
            expect(typeof article.comment_count).toBe("string");

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

          // to check if comment count has been included
          expect(articles[0].comment_count).toBe("11");

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


const express = require("express");
const { getTopics, getApi, getArticleById, getArticles, getCommentsbyArticleId, createCommentByArticleId, updateArticleByArticleId } = require("./controllers/ncNews.controllers");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler} = require("./errorHandlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsbyArticleId)

app.post("/api/articles/:article_id/comments", createCommentByArticleId)

app.patch("/api/articles/:article_id",updateArticleByArticleId)

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = { app };
const express = require("express");
const { getTopics, getApi, getArticleById } = require("./controllers/ncNews.controllers");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler} = require("./errorHandlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById)

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = { app };
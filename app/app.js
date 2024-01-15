const express = require("express");
const { getTopics, getApi, getArticleById } = require("./controllers/ncTopics.controllers");
const { handle400s, handle500s} = require("./errorHandlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById)

app.use(handle400s);
app.use(handle500s);

module.exports = { app };
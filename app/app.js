const express = require("express");
const { getTopics, getApi } = require("./controllers/ncTopics.controllers");
const { handle400s, handle500s} = require("./errorHandlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi)

app.use(handle400s);
app.use(handle500s);

module.exports = { app };
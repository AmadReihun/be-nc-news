const db = require("../../db/connection");
const fs = require("fs/promises")
const endpoint = require("../../endpoints.json")

exports.fetchTopics = () => {
  return db
    .query(
      `
      SELECT * FROM topics`
    )
    .then(({ rows }) => {
      return rows;
    });
}

exports.fetchApi = () => {
  return fs.readFile("/home/amad7/northcoders/backend/be-nc-news/endpoints.json", "utf-8")
  .then((fileContents) => {
    const paredEndpoint = JSON.parse(fileContents);
    return paredEndpoint;
  });
}
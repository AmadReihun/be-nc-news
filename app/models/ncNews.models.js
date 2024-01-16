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

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
      return rows;
    });
}

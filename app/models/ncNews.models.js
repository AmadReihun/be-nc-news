const db = require("../../db/connection");
const fs = require("fs/promises")
const endpoint = require("../../endpoints.json");
const { ident } = require("pg-format");

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

exports.fetchArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id
      ORDER BY created_at DESC;
      `)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
      return rows;
    });
}



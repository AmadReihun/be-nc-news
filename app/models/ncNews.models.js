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
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      `, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
      return rows;
    });
}


exports.fetchArticles = (topic) => {

  let queryStr  =  `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  const queryParameters = [];

  if (topic) {
    queryStr += " WHERE topic = $1 "
    queryParameters.push(topic)
  } 
  
  queryStr += " GROUP BY articles.article_id ORDER BY created_at DESC";
  

    return db.query(queryStr, queryParameters).then(({rows}) => {
      return rows;
    })
}

exports.fetchCommentsbyArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY created_at DESC`, [article_id])
    .then(({ rows }) => {
      return rows;
    });
}

exports.insertCommentByArticleId = (newComment, article_id) => {
  return db
  .query(`
  INSERT into comments
  (author,body,article_id)
  VALUES
  ($1, $2, $3)
  RETURNING *  
  `, [newComment.username, newComment.body, article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
      return rows[0];
    });
}


exports.modifyArticleByArticleId = (article_id, inc_votes) => {
  return db
  .query(`
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *
  `, [article_id, inc_votes])
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return rows[0];
  });
};


exports.removeCommentById = (comment_id) => {
  return db
  .query(`
  DELETE FROM comments
  WHERE comment_id = $1
  `, [comment_id])
  .then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return rowCount;
  });
};

exports.fetchUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
}
const {
  fetchTopics,
  fetchApi,
  fetchArticleById,
  fetchArticles,
  fetchCommentsbyArticleId,
  insertCommentByArticleId,
  modifyArticleByArticleId,
  removeCommentById,
  fetchUsers,
} = require("../models/ncNews.models");

const { checkIdExists, checkTopicExists } = require("../utils");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((endpoint) => {
      res.status(200).send({ endpoint });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order_by } = req.query;

  const fetchTopicQuery = fetchArticles(sort_by, topic, order_by);
  const queries = [fetchTopicQuery];

  if (topic) {
    const topicIdExistenceQuery = checkTopicExists(topic);
    queries.push(topicIdExistenceQuery);
  }

  Promise.all(queries)
    .then((response) => {
      const article = response[0];
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsbyArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const articleIdExistenceQuery = checkIdExists(article_id);
  const fetchQuery = fetchCommentsbyArticleId(article_id);

  Promise.all([fetchQuery, articleIdExistenceQuery])
    .then((response) => {
      const comment = response[0];
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertCommentByArticleId(newComment, article_id)
    .then((postedComment) => {
      res.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleByArticleId = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  modifyArticleByArticleId(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

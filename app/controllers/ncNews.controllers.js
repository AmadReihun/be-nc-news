const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchCommentsbyArticleId} = require("../models/ncNews.models")


exports.getTopics = (req, res, next) => {
  fetchTopics()
  .then((topics) => {
    res.status(200).send({ topics });
  })
  .catch((err) => {
    next(err);
  })
}

exports.getApi = (req, res, next) => {
  fetchApi()
  .then((endpoint) => {
    res.status(200).send({ endpoint });
  })
  .catch((err) => {
    next(err);
  })
}


exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err);
  })
}

exports.getArticles = (req, res, next) => {
  fetchArticles()
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err);
  })
}


exports.getCommentsbyArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsbyArticleId(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err);
  })
}
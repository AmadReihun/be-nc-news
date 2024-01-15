const { fetchTopics, fetchApi, fetchArticleById} = require("../models/ncTopics.models")


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
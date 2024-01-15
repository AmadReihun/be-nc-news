const { fetchTopics, fetchApi} = require("../models/ncTopics.models")


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
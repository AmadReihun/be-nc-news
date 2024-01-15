const { fetchTopics} = require("../models/ncTopics.models")

exports.getTopics = (req, res, next) => {
  fetchTopics()
  .then((data) => {
    res.status(200).send();
  })
  .catch((err) => {
    console.log(err.status);
    next(err);
  })
}
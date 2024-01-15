const { fetchTopics} = require("../models/ncTopics.models")

exports.getTopics = (req, res, next) => {
  fetchTopics()
  .then((topics) => {
    res.status(200).send({ topics });
    console.log(topics , '<<<<<< in controller :D ');
  })
  .catch((err) => {
    console.log(err.status);
    next(err);
  })
}
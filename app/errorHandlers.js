exports.handle400s = (err, req, res, next) => {
  console.log(err);
  // if (err.code === "22P02" || err.code === "23502") {
  //   res.status(400).send({ msg: "Bad request" });
  // } else if (err.code === "23503") {
  //   res.status(404).send({ msg: "Not found" });
  // } else if (err.status === 400) {
  //   res.status(err.status).send({ msg: err.msg });
  // }
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
const ErrorHandler = (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send({ msg: "Something Went Wrong", err });
  }
};

module.exports = ErrorHandler;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");
    res.locals.isPaid = req.body.isPaid;
    next();
  } catch (error) {
    res.locals.isPaid = false;
    next();
  }
};

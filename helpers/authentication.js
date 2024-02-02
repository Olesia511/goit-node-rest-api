const jwt = require("jsonwebtoken");
require("dotenv").config();
const HttpError = require("./HttpError");
const { User } = require("../models/Users");

const { JWT_SECRET } = process.env;

const authVerification = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization not define"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);
    if (!user || !user.token || token !== user.token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

module.exports = authVerification;

const HttpError = require("../helpers/HttpError");

const errStatus = (err, data, next) => {
  err.status = 400;
  next();
};

const updateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators = true;

  next();
};

const emptyObj = function (next) {
  const contact = this._update;

  if (Object.keys(contact).length === 0) {
    throw HttpError(400, "Object is not allowed to be empty");
  }
  next();
};

module.exports = { errStatus, updateOptions, emptyObj };

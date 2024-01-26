const errStatus = (err, data, next) => {
  err.status = 400;
  next();
};

const updateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
};

module.exports = { errStatus, updateOptions };

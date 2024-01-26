const { isValidObjectId } = require("mongoose");
const HttpError = require("./HttpError");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  isValidObjectId(id)
    ? next()
    : next(HttpError(404, `The ID: ${id} is invalid`));
};
module.exports = isValidId;

const controllersWrapper = (controller) => {
  const funcWrap = async (req, res, next) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
  return funcWrap;
};

module.exports = controllersWrapper;

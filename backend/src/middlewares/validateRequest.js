const createAppError = require("../utils/appError");
const { validateMaterialBody } = require("../utils/validators");

// Use higher order function here b/c we need to pass 'isPartial' parameter fo the middle ware that will help us not to invoke the returned middleware immidiately
// This is useful since express router and middleware handle need the func middleware reference (not invoced function)
const validateReques = (isPartial = false) => {
  return (req, res, next) => {
    const errors = validateMaterialBody(req.body, isPartial);

    if (errors.length > 0) {
      return next(createAppError(errors.join(", "), 400));
    }

    next();
  };
};

module.exports = validateReques;

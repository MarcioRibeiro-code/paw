const methodOverride = require("method-override");

const handleRequests = function () {
  return function (req, res, next) {
    console.log("handleRequests middleware called");
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      console.log(`Method override: ${method}`);
      req.method = method.toUpperCase(); // Override the request method with the one specified in _method
    }
    next(); // Pass the request to the next middleware in the chain
  };
};

module.exports = handleRequests;

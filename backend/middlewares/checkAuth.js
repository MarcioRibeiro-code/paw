const jwt = require("jsonwebtoken");
const authenticationConfig = require("../controllers/config/autentication.json");

const checkAuth = async (req, res, next) => {
  const token = req.session.token;

  if (token) {
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, authenticationConfig.secret);
      req.userEmail = decodedToken.email; // Add the decoded email to the request object
      req.role = decodedToken.role;
    } catch (error) {
      // If the token is invalid or expired, clear the session token
      req.session.token = null;
      req.session.isAuthenticated = false; // Set the flag to false
    }
  } else {
    req.session.isAuthenticated = false; // Set the flag to false if no token is present
  }

  next();
};

module.exports = { checkAuth };

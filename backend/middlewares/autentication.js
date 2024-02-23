const jwt = require("jsonwebtoken");
const authenticationConfig = require("../controllers/config/autentication.json");

const authenticate = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    // Token is valid, continue with authentication logic
    // ...
    // Example: set req.userId based on decoded token
    jwt.verify(req.token, authenticationConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(404).send(err);
      }
      req.role = decoded.role; //Extract the role claim form the decoded token
      req.userId = decoded.id; // Update to the appropriate claim name in your JWT token
      next();
    });
  });
};

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  const token = req.session.token; // Access token from req.session
  console.log("BEAREARTOKEN: " + bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    console.log("VERIFY TOKEN 1 "+bearerHeader);
    req.token = bearerHeader;
    next();
  } else if (typeof token !== "undefined") {
    console.log("VERIFY TOKEN 2");
    req.token = token;
    next();
  } else {
    console.log("VERIFY TOKEN 3");
    res.redirect("/login");
  }
}

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  // Check if the user is authenticated and has the admin role
  const token = req.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, authenticationConfig.secret);
      const role = decodedToken.role;

      if (role === "admin") {
        // User is an admin, allow access to the next middleware or route
        next();
      } else {
        // User is not an admin, render them to an error page
        res.render("error", { errorCode: 401, errorMessage: "Unauthorized" });
      }
    } catch (error) {
      // If the token is invalid or expired, handle unauthorized access
      res.status(401).send("Unauthorized access");
    }
  } else {
    // No token provided, handle unauthorized access
    res.status(401).send("Unauthorized access");
  }
};

// Middleware to check if the user is an admin or an employee
const isAdminOrEmployee = async (req, res, next) => {
  // Check if the user is authenticated and has either the admin or employee role
  const token = req.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, authenticationConfig.secret);
      const role = decodedToken.role;

      if (role === "admin" || role === "employee") {
        // User is an admin or employee, allow access to the next middleware or route
        next();
      } else {
        // User is not an admin or employee, render them to an error page
        res.render("error", { errorCode: 401, errorMessage: "Unauthorized" });
      }
    } catch (error) {
      // If the token is invalid or expired, handle unauthorized access
      res.status(401).send("Unauthorized access");
    }
  } else {
    // No token provided, handle unauthorized access
    res.status(401).send("Unauthorized access");
  }
};

// Middleware to check if the user is a regular user
const isUser = async (req, res, next) => {
  // Check if the user is authenticated and has the user role
  const token = req.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, authenticationConfig.secret);
      const role = decodedToken.role;

      if (role === "user") {
        // User is a regular user, allow access to the next middleware or route
        next();
      } else {
        // User is not a regular user, render them to an error page
        res.render("error", { errorCode: 401, errorMessage: "Unauthorized" });
      }
    } catch (error) {
      // If the token is invalid or expired, handle unauthorized access
      res.status(401).send("Unauthorized access");
    }
  } else {
    // No token provided, handle unauthorized access
    res.status(401).send("Unauthorized access");
  }
};

// Middleware to allow access to all authenticated users
const allowAccessToAll = async (req, res, next) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.isAuthenticated;

  if (isAuthenticated) {
    // User is authenticated, allow access to the route
    next();
  } else {
    // User is not authenticated, redirect to the login page or show an error
    res.render("error", { errorCode: 401, errorMessage: "Unauthorized" });
  }
};

// Middleware to check if the user is authorized to access a specific worker
const checkWorkerId = async (req, res, next) => {
  // Get the worker ID from the request parameters
  const workerId = req.params.id;
  // Get the worker ID from the session
  const sessionWorkerId = req.session.workerId;

  if (workerId === sessionWorkerId) {
    // Worker ID matches session worker ID, allow next middleware
    next();
  } else {
    // Worker ID doesn't match session worker ID, handle unauthorized access
    res.status(401).send("Unauthorized access");
  }
};
module.exports = {
  authenticate,
  isAdmin,
  isAdminOrEmployee,
  isUser,
  allowAccessToAll,
  checkWorkerId,
};

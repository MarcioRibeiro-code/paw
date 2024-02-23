const jwt = require("jsonwebtoken");
const authenticationConfig = require("../controllers/config/autentication.json");
const Employee = require("../models/Employee");
const User = require("../models/User");

const loginFronEnd = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email, deleted: false });

    if (!user || user.password !== password) {
      return { error: "Invalid credentials." };
    }
    const role = "user";

    const id = user._id;

    const token = jwt.sign(
      { email: user.email, role, id },
      authenticationConfig.secret,
      { expiresIn: "24h" }
    );
    req.session.token = token;
    req.session.isAuthenticated = true;
    req.session.workerId = user._id;
    res.json({ token, id }); // Send the token as JSON response
  } catch (error) {
    console.error("Error:", error); // Debugging statement
    return res.status(500).render("error", {
      errorCode: 500,
      errorMessage: error.message,
    });
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);
  try {
    console.log("Starting login process"); // Debugging statement

    const user = await Employee.findOne({ email, deleted: false });
    console.log("Employee query completed"); // Debugging statement

    if (!user || user.password !== password) {
      req.flash("error", "Invalid credentials.");
      console.log("Invalid credentials."); // Debugging statement
      return res.redirect("/login");
    }

    const role = user.role;

    if (req.session.isAuthenticated) {
      console.log("Redirecting authenticated employee to /employees"); // Debugging statement
      return res.redirect("/employees"); // Redirect authenticated employees to the appropriate route
    }

    const token = jwt.sign(
      { email: user.email, role },
      authenticationConfig.secret,
      { expiresIn: "24h" } // Set token expiration time, e.g., 24 hours
    );
    req.session.token = token;
    req.session.isAuthenticated = true;
    req.session.workerId = user._id;
    res.json({ token }); // Send the token as JSON response

    console.log("LOGIN PROCESS COMPLETED");
  } catch (error) {
    console.error("Error:", error); // Debugging statement
    return res.status(500).render("error", {
      errorCode: 500,
      errorMessage: error.message,
    });
  }
};

module.exports = { login, loginFronEnd };

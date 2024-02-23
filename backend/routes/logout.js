const express = require("express");
const {
  authenticate,
  allowAccessToAll,
} = require("../middlewares/autentication");
const router = express.Router();

router.get("/", allowAccessToAll, (req, res) => {
   // Clear the session variables related to authentication
  req.session.isAuthenticated = false;
  req.session.role = null;
  req.session.token = null;
  //Redirect to the login page
  res.redirect("/login");
});

module.exports = router;

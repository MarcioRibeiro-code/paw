const express = require("express");
const router = express.Router();
const loginController = require("../controllers/authController");
const { checkAuth } = require("../middlewares/checkAuth");

router.get("/", checkAuth, (req, res) => {
 res.render("./LogIn/logIn")
});

router.post("/", loginController.login);

router.post("/loginf", loginController.loginFronEnd);

module.exports = router;

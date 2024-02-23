const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const handleRequests = require("../middlewares/handleRequests");
const {
  authenticate,
  isAdminOrEmployee,
} = require("../middlewares/autentication");

router.use(handleRequests());
router.get("/", UserController.renderUserForm);
router.post("/", UserController.createUser);

router.get(
  "/showall",
  authenticate,
  isAdminOrEmployee,
  UserController.getUsers
);

router.get("/:id", authenticate, isAdminOrEmployee, UserController.getUser);

router.get("/:id/edit", authenticate, UserController.renderUpdateForm);
router.post(
  "/:id/edit",
  authenticate,

  UserController.updateUser
);

router.get("/:id/delete", authenticate, UserController.deleteUserById);
router.delete(
  "/:id/delete",
  handleRequests(),
  authenticate,
  UserController.handledeleteUser
);

router.get("/:id/info", authenticate, UserController.getUserFrontEnd);

module.exports = router;

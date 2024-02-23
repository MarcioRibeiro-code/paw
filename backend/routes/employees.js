var express = require("express");
var router = express.Router();
const {
  authenticate,
  isAdmin,
  isAdminOrEmployee,
} = require("../middlewares/autentication"); // Update the import statement for the authentication middleware
var employeesController = require("../controllers/employeesController"); // Importa o controller de funcionários
const handleRequests = require("../middlewares/handleRequests");

router.use(handleRequests());

router.get("/register", employeesController.renderRegisterForm);
router.post("/register", employeesController.createEmployee);

router.get(
  "/",
  authenticate,
  isAdminOrEmployee,
  employeesController.getAllEmployees
);

//Este route já dá render dos Details do Funcionario
router.get(
  "/:employeeId",
  authenticate,
  isAdminOrEmployee,
  employeesController.getEmployee
);

/* No editar fará sentido ter que ser o admin a so puder alterar */
router.get(
  "/:employeeId/edit",
  authenticate,
  isAdminOrEmployee,
  employeesController.renderUpdateForm
);
router.post(
  "/:employeeId/edit",
  authenticate,
  isAdminOrEmployee,
  employeesController.updateEmployee
);

router.get(
  "/:employeeId/delete",
  authenticate,
  isAdmin,
  employeesController.renderDeleteEmployee
);
router.delete(
  "/:employeeId/delete",
  handleRequests(),
  authenticate,
  isAdmin,
  employeesController.deleteEmployee
);

module.exports = router;

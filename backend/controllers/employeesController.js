const Employee = require("../models/Employee");
const VerifyEmail = require("../utils/verifyEmail").VerifyEmail;

// Render the register form
exports.renderRegisterForm = (req, res) => {
  const error = req.flash("error");
  res.render("./Employee/createEmployee", { error });
};

// Create a new employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, role, email, password } = req.body;

    const newEmployee = new Employee({ name, role, email, password });

    await VerifyEmail(email);

    await newEmployee.save();
    req.flash("success", "Funcionário criado com sucesso");
    res.redirect("./register?success=true");
  } catch (error) {
    if (error.message === "Existing Email, please insert a different Email") {
      req.flash("error", "Email já existente. Insira um email diferente.");
      return res.redirect("./register");
    }

    if (error.name === "ValidationError") {
      req.flash("error", "Por favor, insira uma senha válida");
      return res.redirect("./register");
    }

    res.render("error", {
      errorCode: error.statusCode || 500,
      errorMessage: error.message,
    });
  }
};

// Get employee details
exports.getEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Employee.findById(employeeId);
    if (!employee || employee.deleted) {
      req.flash("error", "Funcionário não encontrado na Base de dados");
      return res.redirect("/employees");
    }
    res.render("./Employee/employeeDetails", { employee });
  } catch (error) {
    next(error);
  }
};

// Render the update form
exports.renderUpdateForm = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Employee.findById(employeeId);
    if (!employee || employee.deleted) {
      req.flash("error", "Funcionário não encontrado na Base de dados");
      res.render("error", { errorCode: 403, errorMessage: req.flash("error") }); // Render the error view with error messages
    }
    res.render("./Employee/updateEmployee", { employee, updated: false });
  } catch (error) {
    next(error);
  }
};

// Update employee details
exports.updateEmployee = async (req, res, next) => {
  try {
    // Obtém o ID do usuário a partir dos parâmetros da requisição
    const employeeId = req.params.employeeId;

    // Busca o usuário no banco de dados pelo ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee não encontrado na Base de dados" });
    }

    if (employee.deleted) {
      return res.render("error", {
        errorCode: 403,
        employeeMessage: "employee Deleted",
      });
    }

    // Atualiza apenas os campos fornecidos em req.body e mantém os campos existentes não fornecidos
    const updatedFields = { ...employee.toObject(), ...req.body };

    for (const key in updatedFields) {
      if (!updatedFields[key]) {
        updatedFields[key] = employee[key];
      }
    }

    if (employee.email !== updatedFields.email) {
      VerifyEmail(updatedFields.email);
    }

    console.log(updatedFields);

    // Atualiza os campos do usuário no banco de dados
    const updatedemployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    res.render("./Employee/updateEmployee", {
      employee: updatedemployee,
      updated: true,
    });
  } catch (err) {
    return next(err);
  }
};

// Render the delete form
exports.renderDeleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Employee.findById(employeeId);
    if (!employee || employee.deleted) {
      req.flash("error", "Funcionário não encontrado na Base de dados");
      return res.redirect("/employees");
    }
    res.render("./Employee/deleteEmployee", { employee, deleted: false });
  } catch (error) {
    next(error);
  }
};

// Soft delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { deleted: true },
      { new: true }
    );
    if (!employee || employee.deleted) {
      req.flash("error", "Funcionário não encontrado na Base de dados");
      return res.redirect("/employees");
    }
    res.render("./Employee/deleteEmployee", { employee, deleted: true });
  } catch (error) {
    next(error);
  }
};

// Get all employees
exports.getAllEmployees = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const employees = await Employee.find({ deleted: false })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEmployees = await Employee.countDocuments({
      deleted: false,
    }).exec();
    const totalPages = Math.ceil(totalEmployees / limit);

    res.render("./Employee/getAllEmployees", {
      employees,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).render("error", {
      errorCode: 500,
      errorMessage: "Internal Server Error",
    });
  }
};
module.exports = exports;

var mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Importação do pacote JWT
const authentication = require("../controllers/config/autentication.json");

var employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "employee"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        //regex para um email válido
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "Por favor, insira um email válido",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // expressão regular onde requer que a senha tenha pelo menos 8 caracteres,
        // contenha pelo menos uma letra maiúscula, uma letra minúscula e um número
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(
          value
        );
      },
      message:
        "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número",
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  // outros campos do modelo de funcionário
});
module.exports = mongoose.model("Employee", employeeSchema);

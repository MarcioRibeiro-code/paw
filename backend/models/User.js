const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
    set: (value) => parseFloat(value.toFixed(2)),
    get: (value) => parseFloat(value.toFixed(2)),
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

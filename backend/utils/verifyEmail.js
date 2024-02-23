const User = require("../models/User");
const Employee = require("../models/Employee");

async function VerifyEmail(newEmail) {
    const foundUser = await User.findOne({
      email: newEmail,
      deleted: false,
    });
    const foundEmployee = await Employee.findOne({
      email: newEmail,
      deleted: false,
    });
    if (foundUser || foundEmployee) {
      throw new Error("Existing Email, please insert a different Email");
    }
}

module.exports = {
    VerifyEmail
}
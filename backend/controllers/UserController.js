const UserController = {};
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const VerifyEmail = require("../utils/verifyEmail").VerifyEmail;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

UserController.renderUserForm = (req, res) => {
  res.render("./Users/createUser");
};

UserController.renderUpdateForm = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user || user.deleted) {
        throw new Error("User not found");
      }
      res.render("./Users/updateUser", {
        user: user,
        updated: false,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

UserController.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User não encontrado na Base de dados" });
    }

    // Find all tickets with the user ID
    const tickets = await Ticket.find({ users: userId }).populate({
      path: "events locals",
    });

    res.render("./Users/DetailsUser", { user, tickets });
  } catch (err) {
    next(err);
  }
};

UserController.getUserFrontEnd = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User não encontrado na Base de dados" });
    }

    // Find all tickets with the user ID
    const tickets = await Ticket.aggregate([
      {
        $match: {
          users: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "events",
          foreignField: "_id",
          as: "events",
        },
      },
      {
        $lookup: {
          from: "locals",
          localField: "locals",
          foreignField: "_id",
          as: "locals",
        },
      },
      {
        $addFields: {
          locals: {
            $arrayElemAt: ["$locals.localdata.properties.name", 0],
          },
        },
      },
      {
        $project: {
          events: "$events.title",
          locals: 1,
          price: 1,
          free: 1,
          date: 1,
          promotion: 1,
        },
      },
      {
        $unwind: {
          path: "$events",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$locals",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    console.log(tickets);

    //Returns in a json the User information and the tickets bought by the user
    res.json({ user, tickets });
  } catch (err) {
    next(err);
  }
};

const PAGE_SIZE = 10; // Number of users per page

UserController.getUsers = async (req, res, next) => {
  const page = req.query.page || 1; // Número da página atual (Padrão: 1)
  const limit = 10; // Número de usuários a serem exibidos por página
  const skip = (page - 1) * limit; // Calcula o número de documentos a serem ignorados

  try {
    const currentPage = parseInt(req.query.page) || 1; // Current page (default: 1)

    // Find the total count of users
    const totalCount = await User.countDocuments({ deleted: false });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Find users based on pagination parameters
    const users = await User.find({ deleted: false })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.render("./Users/getUsers", { users, currentPage, totalPages });
  } catch (err) {
    next(err);
  }
};

UserController.createUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = new User(req.body); // Create a new user object without saving it to the database
    await VerifyEmail(email); // Run the VerifyEmail function

    // If no errors are thrown, save the user to the database
    await user.save();

    res.redirect("/users/showall");
  } catch (err) {
    next(err);
  }
};
UserController.updateUser = async (req, res, next) => {
  try {
    // Obtém o ID do usuário a partir dos parâmetros da requisição
    const userId = req.params.id;

    // Busca o usuário no banco de dados pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilizador não encontrado na Base de dados" });
    }

    if (user.deleted) {
      return res.render("error", {
        errorCode: 403,
        userMessage: "User Deleted",
      });
    }

    // Atualiza apenas os campos fornecidos em req.body e mantém os campos existentes não fornecidos
    const updatedFields = { ...user.toObject(), ...req.body };

    for (const key in updatedFields) {
      if (!updatedFields[key]) {
        updatedFields[key] = user[key];
      }
    }

    if (user.email !== updatedFields.email) {
      VerifyEmail(updatedFields.email);
    }

    console.log(updatedFields);

    // Atualiza os campos do usuário no banco de dados
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.render("./Users/updateUser", {
      user: updatedUser,
      updated: true,
    });
  } catch (err) {
    return next(err);
  }
};

UserController.deleteUserById = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    if (userToDelete.deleted) {
      return res.render("error", {
        errorCode: 403,
        errorMessage: "User already deleted",
      });
    }
    res.render("./Users/deleteUser", { user: userToDelete });
  } catch (error) {
    next(error);
  }
};

UserController.handledeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User não encontrado na Base de dados" });
    }

    // Soft delete the user by setting the 'deleted' field to true
    user.deleted = true;
    await user.save();

    req.flash("success", "Utilizador removido da base de dados");
    res.redirect("/users/showall");
  } catch (error) {
    next(error);
  }
};

module.exports = UserController;

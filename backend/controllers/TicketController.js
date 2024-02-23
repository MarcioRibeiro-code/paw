const TicketController = {};
const Ticket = require("../models/Ticket");
const Employee = require("../models/Employee");
const User = require("../models/User");
const Local = require("../models/local").local;
const moment = require("moment");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


TicketController.renderCreateTicketForm = async (req, res) => {
  try {
    // Fetch locals from the database
    const locals = await Local.find({ deleted: false }).populate(
      "eventsOcurring"
    );

    res.render("./Tickets/createTicket", {
      locals,
    });
  } catch (error) {
    console.error(error);

    // Render the createTicket view with error message
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: error.message });
  }
};

TicketController.sellTicketView = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({ deleted: false });

    // Check if there are any users
    if (users.length === 0) {
      req.flash("error", "No users found");
      res.render("error", { errorCode: 403, errorMessage: req.flash("error") }); // Render the error view with error messages
    }

    const ticket = await Ticket.findById(req.params.id);

    if (ticket.length === 0) {
      req.flash("error", "No Ticket found");
      res.render("./Tickets/ticketError", {
        errorMessages: req.flash("error"),
      }); // Render the error view with error messages
    }

    // Render the addTicketToUser view and pass the users
    res.render("./Tickets/addTicketToUser", { users, ticket });
  } catch (error) {
    req.flash("error", error.message);
    res.render("error", { errorCode: 500, errorMessage: req.flash("error") }); // Render the error view with error messages
  }
};
TicketController.sellTicket = async (req, res) => {
  try {
    const ticketToSell = req.params.id;
    const { userId, promotion } = req.body;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketToSell);
    if (!ticket) {
      req.flash("error", "Ticket not found");
      return res.render("./Tickets/ticketError", {
        errorMessages: req.flash("error"),
      });
    }

    // Check if the user has enough points
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found");
      return res.render("./Tickets/ticketError", {
        errorMessages: req.flash("error"),
      });
    }

    if (user.deleted) {
      return res.render("error", {
        errorCode: 403,
        errorMessage: "User Deleted",
      });
    }

    let selectedPromotion;

    console.log(promotion);
    console.log(ticket.price.toString());
    if (promotion === ticket.price.toString()) {
      // Use the ticket's original price as the selected promotion
      selectedPromotion = {
        price: ticket.price,
        pointsNeeded: 0,
      };
    } else {
      // Find the selected promotion by price
      selectedPromotion = ticket.promotion.find(
        (promo) => promo.price.toString() === promotion
      );
    }
    console.log(selectedPromotion);
    console.log("USER PINTS: " + user.points);
    if (!selectedPromotion) {
      req.flash("error", "Invalid promotion");
      return res.render("./Tickets/ticketError", {
        errorMessages: req.flash("error"),
      });
    }

    if (selectedPromotion.pointsNeeded > user.points) {
      req.flash("error", "Insufficient points");
      return res.render("./Tickets/ticketError", {
        errorMessages: req.flash("error"),
      });
    }

    // Subtract the points needed for the promotion
    user.points -= selectedPromotion.pointsNeeded;

    // Calculate the points earned based on the amount spent (1 point per 1 euro)
    const pointsEarned = Math.floor(selectedPromotion.price * 0.3);
    user.points += pointsEarned;
    user.balance -= selectedPromotion.price;

    await user.save();

    // PUSH the user ID into the ticket's users field
    ticket.users.push(userId);

    // Perform any other necessary actions for selling the ticket

    await ticket.save();
    req.flash("success", "Ticket sold successfully");
    res.redirect("/ticket");
  } catch (error) {
    console.error(error);

    req.flash("error", "Ticket selling failed");
    res.render("ticketError", { errorMessages: req.flash("error") });
  }
};

TicketController.filteredEvents = async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);
    const selectedLocalId = req.params.localId;

    const filteredLocal = await Local.findById(selectedLocalId).populate({
      path: "eventsOcurring",
      match: {
        startTime: { $lte: moment(selectedDate).toDate() },
        endTime: { $gte: moment(selectedDate).toDate() },
      },
    });

    if (!filteredLocal) {
      return res.status(404).json({ error: "Local not found" });
    }

    const filteredEvents = filteredLocal.eventsOcurring;

    if (filteredEvents.length === 0) {
      return res.status(404).json({ error: "No events found" });
    }

    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
TicketController.createTicket = async (req, res) => {
  try {
    const { events, locals, date, free } = req.body;
    const workerId = req.session.workerId;

    const ticket = new Ticket({
      events: events,
      free: free,
      locals: locals,
      employeeID: workerId,
      date: date,
    });
    console.log(ticket);

    const worker = await Employee.findById(workerId);
    if (!worker || worker.deleted) {
      throw new Error("Invalid worker ID");
    }

    const isValid = await ticket.checkValidity();
    if (!isValid) {
      throw new Error("Invalid events or locals in the ticket");
    }

    if (free === "true") {
      ticket.price = 0;
    } else {
      const totalPrice = await ticket.calculateTicketPrice();
      console.log(totalPrice);
      ticket.price = totalPrice;
      await ticket.calculatePromotion();
    }

    await ticket.save();

    res.redirect("/ticket?success=true");
  } catch (error) {
    console.error(error);

    res.status(400).render("error", {
      errorCode: 400,
      errorMessage: "Cannot create Ticket",
    });
  }
};

TicketController.getTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.id;

    // find the ticket by ID
    const ticket = await Ticket.findById(ticketId)
      .populate("employeeID")
      .populate("users")
      .populate("events")
      .populate("locals");
    // check if the ticket exists
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    res.render("./Tickets/getTicket", { ticket });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};
TicketController.getAllTickets = async (req, res, next) => {
  try {
    const perPage = 10; // Number of tickets per page
    const currentPage = parseInt(req.query.page) || 1; // Current page (default: 1)

    // Find the total count of tickets
    const totalCount = await Ticket.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / perPage);

    // Find tickets based on pagination parameters
    const tickets = await Ticket.find()
      .populate("employeeID")
      .populate("users")
      .populate("events")
      .populate("locals")
      .sort("employeeID")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!tickets) {
      const error = new Error("No tickets found");
      error.status = 404;
      throw error;
    }

    res.render("./Tickets/getAllTickets", { tickets, currentPage, totalPages });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware or error handler
  }
};

TicketController.getTicketFrontEnd = async (req, res, next) => {
  try {
    const ticketId = req.params.id;


   const ticket= await Ticket.aggregate([
      {
        $match: {
          _id: new ObjectId(ticketId),
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
          "locals": {
            $arrayElemAt: [
              "$locals.localdata.properties.name",
              0,
            ],
          },
        },
      },
      {
        $project: {
          "events": "$events.title",
          "locals": 1,
          price: 1,
          free: 1,
          date:1,
          promotion:1
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

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

TicketController.getAllTicketByEventFrontEnd = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Find tickets related to the event
    const tickets = await Ticket.find({ events: eventId });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

TicketController.getAllTicketByLocalFrontEnd = async (req, res, next) => {
  try {
    const localId = req.params.id;

    // Find tickets related to the event
    const tickets = await Ticket.find({ locals: localId });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = TicketController;

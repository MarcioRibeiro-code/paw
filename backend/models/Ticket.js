const mongoose = require("mongoose");
const Event = require("./Events");
const Local = require("./local").local;

const ticketSchema = new mongoose.Schema({
  events: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  locals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "local",
  },
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  date: {
    type: "date",
    required: true,
  },
  free: {
    type: Boolean,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  promotion: [
    {
      price: Number,
      pointsNeeded: Number,
    },
  ],
});

ticketSchema.methods.checkValidity = async function () {
  const event = this.events;
  const local = this.locals;

  if ((!event && local) || (event && !local)) {
    // If either event or local is empty and the other has content, consider it valid
    return true;
  }

  if (!event && !local) {
    // If both event and local are empty, consider it invalid
    return false;
  }

  const validEvent = await Event.findById(event);
  const validLocal = await Local.findById(local);

  return validEvent && validLocal;
};

ticketSchema.methods.calculateTicketPrice = async function () {
  try {
    let totalPrice = this.price;

    // Calculate the price of the event in the ticket
    if (this.events) {
      const foundEvent = await Event.findById(this.events);
      if (foundEvent && foundEvent.price) {
        totalPrice += foundEvent.price;
      }
    }

    // Calculate the price of the local in the ticket
    if (this.locals) {
      const foundLocal = await Local.findById(this.locals);
      if (foundLocal && foundLocal.price) {
        totalPrice += foundLocal.price;
      }
    }

    return totalPrice;
  } catch (error) {
    console.error(error);
    throw new Error("Error calculating ticket price");
  }
};

ticketSchema.methods.calculatePromotion = async function () {
  const discounts = [0.1, 0.2, 0.3]; // DISCOUNTS (10%,20%,30%)
  const basePoints = Math.round(this.price*1.7); //Calculate base points based on price
  const pointsMultiplier = 1.2; //Points multiplier to increase required points

  for (let i = 0; i < discounts.length; i++) {
    const discount = discounts[i];
    const pointsNeeded = Math.round(basePoints * Math.pow(pointsMultiplier, i));
    const priceWithDiscount = Math.ceil(this.price * (1 - discount));

    this.promotion.push({ price: priceWithDiscount, pointsNeeded });
  }
};

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

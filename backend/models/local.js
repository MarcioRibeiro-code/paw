var mongoose = require("mongoose");

var localModel = new mongoose.Schema({
  localdata: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  eventsOcurring: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  price: {
    type: Number,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const local = mongoose.model("local", localModel);
module.exports = {
  local,
  localModel,
};

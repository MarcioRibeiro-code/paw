const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: "Price must be greater than or equal to zero",
    },
    required: function () {
      return this.eventType === "paid";
    },
  },
  image: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

eventSchema.pre("save", function (next) {
  if (this.price === null) {
    this.price = 0;
  }
  next();
});

// Adicione um método "static" ao modelo para fazer upload da imagem
eventSchema.statics.uploadImage = function () {
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/public/uploads/"); // Diretório onde as imagens serão armazenadas
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Renomeie o arquivo para evitar colisões de nome
    },
  });

  const upload = multer({ storage: storage });

  return upload.single("image"); // "image" é o nome do campo de entrada no formulário HTML
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

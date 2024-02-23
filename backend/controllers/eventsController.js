const Event = require("../models/Events");
const upload = require("../middlewares/upload");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { IncomingMessage } = require("http");
const local = require("../models/local").local;

const renderEventForm = async (req, res) => {
  try {
    const locals = await local.find();

    if (!locals) {
      throw new Error("No locals");
    }

    res.render("./Events/createEvent", { locals });
  } catch (Error) {
    res.status(500).render("error", {
      errorCode: 500,
      errorMessage: "Internal Server Error!",
    });
  }
};

const uploadImage = (req, res, next) => {
  try {
    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during upload
        return res.status(400).render("error", {
          errorCode: 400,
          errorMessage: "File upload Error!",
        });
      } else if (err) {
        // An unknown error occurred during upload
        return res
          .status(500)
          .render("error", { errorCode: 500, errorMessage: err.message });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        // No file was uploaded
        return res.status(400).render("error", {
          errorCode: 400,
          errorMessage: "No file Uploaded",
        });
      }

      const { filename, originalname, mimetype, size } = uploadedFile;
      res.send({ filename, originalname, mimetype, size });
    });
  } catch (err) {
    return res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: err.message });
  }
};

const replaceImage = async (req, res, next) => {
  try {
    upload.single("image")(req, res, async function (err) {
      const eventId = req.params.id;
      const imageFile = req.file;

      // Check if an image was uploaded
      if (!imageFile) {
        return res.status(400).render("error", {
          errorCode: 400,
          errorMessage: "No image file provided",
        });
      }

      // Get the event by ID to retrieve the existing image name
      const event = await Event.findById(eventId).exec();

      // Check if the event is deleted
      if (!event || event.deleted) {
        throw new Error("Evento não encontrado");
      }

      // Delete the existing image file if it exists
      if (event.image) {
        const imagePath = path.join(
          __dirname,
          "../public/uploads/",
          event.image
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            return res.status(500).render("error", {
              errorCode: 500,
              errorMessage: "Failed to delete image file: ${err}",
            });
          }
        });
      }

      // Update the event image filename
      event.image = imageFile.filename;
      await event.save();

      res.redirect("/events");
    });
  } catch (error) {
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startTime,
      endTime,
      eventType,
      price,
      imageFilename,
    } = req.body;

    const Local = await local.findById(location);

    if (!Local) {
      throw new Error("Local not found");
    }

    //Check if there's an existing event with the same content
    const existingEvent = await Event.findOne({
      title,
      description,
      location: Local.localdata.properties.name,
      startTime,
      endTime,
      eventType,
      price,
    });

    if (existingEvent) {
      throw new Error("Event with the same content already exists");
    }

    const { filename } = JSON.parse(imageFilename);

    const newEvent = new Event({
      title,
      description,
      location: Local.localdata.properties.name,
      startTime,
      endTime,
      eventType,
      price,
      image: filename,
    });

    //PUSH the new event into Local.eventsOcurring
    Local.eventsOcurring.push(newEvent);

    //Save the upted Local object
    await Local.save();
    //Save the new event
    await newEvent.save();

    req.flash("Event created successfully");
    res.redirect("/events");
  } catch (error) {
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: error.message });
  }
};

const getEvents = async (req, res) => {
  const page = req.query.page || 1; // Current page number (Default:1)
  const limit = 10; //Number of events to display per page
  const skip = (page - 1) * limit; //Calculate the number of documents to skip

  try {
    const events = await Event.find({ deleted: false })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEvents = await Event.countDocuments({ deleted: false }).exec();
    const totalPages = Math.ceil(totalEvents / limit);

    res.render("./Events/getAllEvents", {
      events,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getEventsFrontEnd = async (req, res) => {
  try {
    const events = await Event.find({ deleted: false }).exec();

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Evento não encontrado",
      });
    }

    res.render("./Events/getEvent", { event });
  } catch (error) {
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: error.message });
  }
};

const getEventByIdFrontEnd = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Evento não encontrado",
      });
    }

    res.json(event);
  } catch (error) {
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: error.message });
  }
};

const getImage = (req, res) => {
  const imageName = req.params.imageName;

  const imagePath = path.join(__dirname, "../public/uploads", imageName);

  res.sendFile(imagePath);
};

const renderUpdateForm = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    if (event.deleted) {
      return res
        .status(403)
        .json({ error: "Evento está marcado como deletado" });
    }

    res.render("./Events/updateEvent", { event, updated: false });
  } catch (error) {
    next(error);
  }
};

const updateEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent || updatedEvent.deleted === true) {
      return res.status(404).render("error", {
        errorCode: 404,
        erroMessage: "Evento não encontrado na base de dados",
      });
    }
    res.render("./Events/updateEvent", { event: updatedEvent, updated: true });
  } catch (error) {
    next(error);
  }
};

const deleteEventById = async (req, res, next) => {
  try {
    const eventToDelete = await Event.findById(req.params.id);
    if (!eventToDelete) {
      return res
        .status(404)
        .render({ errorCode: 404, errorMessage: "Evento não encontrado" });
    }
    if (eventToDelete.deleted) {
      return res.status(403).render("error", {
        errorCode: 403,
        errorMessage: "Evento marcado como deletado",
      });
    }

    res.render("events/deleteEvent", { event: eventToDelete });
  } catch (error) {
    next(error);
  }
};

const handleDeleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.redirect("/events");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderEventForm,
  createEvent: [upload.single("image"), createEvent],
  getEvents,
  getEventsFrontEnd,
  uploadImage,
  getEventById,
  getImage,
  getEventByIdFrontEnd,
  renderUpdateForm,
  updateEventById,
  deleteEventById,
  handleDeleteEvent,
  replaceImage,
};

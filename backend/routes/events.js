const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventsController"); // Assuming the controller is defined in a separate file
const {
  authenticate,
  isAdmin,
  isAdminOrEmployee,
  allowAccessToAll,
} = require("../middlewares/autentication");
const handleRequests = require("../middlewares/handleRequests");

const TicketController = require("../controllers/TicketController");

router.use(handleRequests());
// CREATE (Create a new event)
router.get(
  "/create",
  authenticate,
  isAdminOrEmployee,
  eventController.renderEventForm
);
router.post(
  "/create",
  authenticate,
  isAdminOrEmployee,
  eventController.createEvent
);

//UPLOAD IMAGE TO SERVER
router.post(
  "/upload",
  authenticate,
  isAdminOrEmployee,
  eventController.uploadImage
);

// READ (Get events)
router.get("/", authenticate, allowAccessToAll, eventController.getEvents);

//FRONTEND: Route for getting all events
router.get('/all',authenticate, eventController.getEventsFrontEnd);


router.get("/images/:imageName",eventController.getImage);

// READ (Get a single event by ID)
router.get(
  "/:id",
  authenticate,
  allowAccessToAll,
  eventController.getEventById
);

// FRONTEND: READ (Get a single event by ID)
router.get(
  "/:id/info",
  authenticate,
  eventController.getEventByIdFrontEnd
);


// UPDATE (Update an event by ID)
router.get(
  "/:id/edit",
  authenticate,
  isAdminOrEmployee,
  eventController.renderUpdateForm
);
router.post(
  "/:id/edit",
  authenticate,
  isAdminOrEmployee,
  eventController.updateEventById
);

router.post(
  "/:id/upload",
  authenticate,
  isAdminOrEmployee,
  eventController.replaceImage
);

// DELETE (Delete an event by ID)
router.get(
  "/:id/delete",
  authenticate,
  isAdmin,
  eventController.deleteEventById
);
router.delete(
  "/:id/delete",
  handleRequests(),
  authenticate,
  isAdmin,
  eventController.handleDeleteEvent
);


// Get all tickets by event
router.get(
  "/:id/tickets",
  authenticate,
  TicketController.getAllTicketByEventFrontEnd
);

module.exports = router;

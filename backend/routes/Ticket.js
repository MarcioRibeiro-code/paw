const express = require("express");
const TicketController = require("../controllers/TicketController");
const {authenticate, isAdminOrEmployee, allowAccessToAll} = require("../middlewares/autentication");

const router = express.Router();

// Create a new ticket
router.get("/create", authenticate, isAdminOrEmployee,TicketController.renderCreateTicketForm);
router.post("/create", authenticate, isAdminOrEmployee,TicketController.createTicket);

// Get all tickets
router.get("/", authenticate,allowAccessToAll,TicketController.getAllTickets);



router.get("/filteredEvents/:date/:localId",authenticate, allowAccessToAll,TicketController.filteredEvents);
// Get a specific ticket by ID
router.get("/:id", authenticate,allowAccessToAll,TicketController.getTicketById);

router.get("/:id/info", authenticate,  TicketController.getTicketFrontEnd);

//SELL TICKET TO USER - VIEW
router.get("/:id/sell", authenticate, isAdminOrEmployee,TicketController.sellTicketView);
router.post("/:id/sell", authenticate,TicketController.sellTicket);

module.exports = router;

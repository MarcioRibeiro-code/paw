const express = require("express");
const router = express.Router();
const localController = require("../controllers/localController");
const {authenticate, isAdminOrEmployee, allowAccessToAll, isAdmin} = require("../middlewares/autentication");
const handleRequests = require("../middlewares/handleRequests");

const TicketController = require("../controllers/TicketController")

router.use(handleRequests());
//Route for rendering the getLocalData view
router.get("/info",authenticate,isAdminOrEmployee,localController.getLocalDataView);
// Route for getting local data
router.get("/info/data", authenticate, isAdminOrEmployee,localController.getLocalData);

//Route for rendering the getAllData view
router.get("/all",authenticate,allowAccessToAll,localController.getAllData);

router.get("/allfrontend", authenticate, localController.getAllDataFrontEnd);

//Router for rendering the add Places View
router.get("/add",authenticate,isAdminOrEmployee,localController.addPlacesView);
// Route for adding local places
router.post("/add", authenticate,isAdminOrEmployee,localController.addPlaces);


router.get("/create",authenticate,isAdminOrEmployee,localController.createLocalPlaceView);

// Route for creating a new local place
router.post("/create", authenticate, isAdminOrEmployee,localController.createLocalPlace);

// Route for rendering the getData view
router.get("/:id", authenticate, allowAccessToAll,localController.getData);


//Route for rendering the updateLocationPrice view
router.get("/:id/price",authenticate,isAdminOrEmployee,localController.updateLocationPriceView)

// Route for updating location price by ID
router.put(
  "/:id/price",
  handleRequests(),
  authenticate,
  isAdminOrEmployee,
  localController.updateLocationPrice
);

//Route for rendering the updateLocationPrice view
router.get("/:id/update",authenticate,isAdminOrEmployee,localController.updateLocalPlaceByIdView);

// Route for updating a local place by ID
router.put(
  "/:id/update",
  handleRequests(),
  authenticate,
  isAdminOrEmployee,
  localController.updateLocalPlaceById
);


//Route for render delete View
router.get("/:id/delete",authenticate,isAdmin,localController.deleteLocalById);

// Route for deleting a local place by ID
router.delete(
  "/:id/delete",
  handleRequests(),
  authenticate,
  isAdmin,
  localController.handledeleteLocalPlaceById
);




// Get all tickets by local
router.get("/:id/tickets", authenticate,  TicketController.getAllTicketByLocalFrontEnd);



router.get("/:id/info",authenticate,localController.getDataFrontEnd);

module.exports = router;

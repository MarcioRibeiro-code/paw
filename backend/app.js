var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var flash = require("connect-flash");

var indexRouter = require("./routes/index");
var placesRouter = require("./routes/places");
var employeesRouter = require("./routes/employees");
var eventsRouter = require("./routes/events");
var TicketRouter = require("./routes/Ticket");
var authenticationRouter = require("./routes/authentication");
var usersRouter = require("./routes/users");
var logoutRouter = require("./routes/logout");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

require("./mongo");

var app = express();

var cors = require('cors');

var authenticationConfig = require("./controllers/config/autentication.json");



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// Serve static files from the public directory
app.use(express.static("public"));
// Configure session middleware
app.use(
  session({
    secret: authenticationConfig.secret, // Secret key used to sign the session ID cookie
    resave: false, // Whether to save the session for every request, even if it's not modified
    saveUninitialized: false, // Whether to save uninitialized sessions
    cookie: {
      secure: false, // Set it to true if using HTTPS
      httpOnly: true, // Restrict access to the session cookie to HTTP only
      maxAge: 86400000, // Expiration time of the session cookie in milliseconds (e.g., 24 hours)
    },
  })
);
app.use(flash());
app.use(cors({ origin: 'http://localhost:4200' }));

// Configuração do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/places", placesRouter);
app.use("/employees", employeesRouter);
app.use("/events", eventsRouter);
app.use("/ticket", TicketRouter);
app.use("/login", authenticationRouter);
app.use("/logout", logoutRouter);



// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page with the updated template
    console.log(res.locals.message);
    console.log(res.locals.error);
    res.status(err.status || 500);
    res.render("error", {
        errorCode: err.status,
        errorMessage:
            req.app.get("env") === "development"
                ? err.message
                : "Internal Server Error",
    });
});

module.exports = app;

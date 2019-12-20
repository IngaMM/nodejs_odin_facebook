/////// app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const dev_db_url = process.env.DEV_DB_URI;
const mongoDb = process.env.PROD_DB_URI || dev_db_url;
mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index");
var odinbookRouter = require("./routes/odinbook");
var compression = require("compression");
var helmet = require("helmet");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.locals.moment = require("moment");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/odinbook", odinbookRouter);
app.use("/auth", authRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

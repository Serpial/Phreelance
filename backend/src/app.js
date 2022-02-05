require("dotenv").config({ path: ".env.local" });

const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ErrorWithCode = require("./models/error-with-code");
const auctionsRoutes = require("./routes/auctions-routes");
const bidsRoutes = require("./routes/bids-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.FrontEndHost);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api/auctions", auctionsRoutes);
app.use("/api/bids", bidsRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, _res, _next) => {
  throw new ErrorWithCode("Could not find this route.", 404);
});

app.use((error, _req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.responseCode || 500)
    .json({ message: error.message || "Unknown error." });
});

const connectionString =
  `mongodb+srv://${process.env.MONGODB_USER}` +
  `:${process.env.MONGODB_PASS}` +
  `@${config.DBHost}`;
mongoose
  .connect(connectionString)
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));

module.exports = app;

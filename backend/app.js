require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ErrorWithCode = require("./models/error-with-code");
const auctionsRoutes = require("./routes/auctions-routes");
const bidsRoutes = require("./routes/bids-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/auctions", auctionsRoutes);
app.use("/api/bids", bidsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new ErrorWithCode("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.responseCode || 500)
    .json({ message: error.message || "Unknown error." });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}` +
      "@testcluster.shi6n.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));

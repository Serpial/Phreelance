const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  description: { type: String, required: true, minlength: 10 },
  value: { type: Number, required: true },
  timeEstimation: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  auction: { type: mongoose.Types.ObjectId, required: true, ref: "Auction" },
  created: { type: Date, required: true },
  lastChange: { type: Date, required: true },
});

module.exports = mongoose.model("Bid", bidSchema);

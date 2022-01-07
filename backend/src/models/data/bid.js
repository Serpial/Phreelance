const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  description: { type: String, required: true, minlength: 10 },
  value: { type: Number, required: true },
  timeEstimation: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  auction: { type: mongoose.Types.ObjectId, required: true, ref: "Auction" },
  created: { type: Date, required: true },
  lastChange: { type: Date, required: true },
});

bidSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Bid", bidSchema);

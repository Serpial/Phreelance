const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String, required: true }],
  auctionType: { type: String, required: true },
  isPublic: { type: Boolean },
  isSealed: { type: Boolean },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created: { type: Date, required: true },
  starting: { type: Date, required: true },
  finishing: { type: Date, required: true },
});

auctionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Auction", auctionSchema);

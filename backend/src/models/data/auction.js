const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  meaningfulId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  auctionType: { type: String, required: true },
  isPublic: { type: Boolean },
  reservePrice: { type: Number, required: true },
  startingPrice: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created: { type: Date, required: true },
  starting: { type: Date, required: true },
  finishing: { type: Date, required: true },
});

module.exports = mongoose.model("Auction", auctionSchema);

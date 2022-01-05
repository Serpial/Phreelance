const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const ErrorWithCode = require("../models/error-with-code");
const Bid = require("../models/data/bid");
const User = require("../models/data/user");
const Auction = require("../models/data/auction");

const createBidForUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode(
        "Inputs are invalid. Please check before trying again.",
        422
      )
    );
  }

  const userId = req.params.userID;
  const auctionId = req.params.auctionID;
  const { value, description, timeEstimation } = req.body;

  const newBid = new Bid({
    value,
    description,
    timeEstimation,
    creator: userId,
    auction: auctionId,
    created: Date.now(),
    lastChange: Date.now(),
  });

  let user, auction;
  try {
    user = await User.findById(userId);
    auction = await Auction.findById(auctionId);
  } catch (error) {
    return next(
      new ErrorWithCode("Could not create bid. Please try again.", 404)
    );
  }

  if (!user || !auction) {
    return next(
      new ErrorWithCode("Could not retreive user or auction. Please try again.", 422)
    );
  }

  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    await newBid.save({ session: mongooseSession });

    user.bids.push(newBid);
    await user.save({ session: mongooseSession });

    auction.bids.push(newBid);
    await auction.save({ session: mongooseSession });

    await mongooseSession.commitTransaction();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not complete creation transaction. Please try again.", 500)
    );
  }
  res.status(201).json({ bid: newBid.toObject({ getters: true }) });
};

const getBidsByUser = async (req, res, next) => {
  const userId = req.params.userID;

  let bids;
  try {
    bids = await Bid.find({ creator: userId });
  } catch (err) {}

  if (!bids | (bids.length <= 0)) {
    return next(new ErrorWithCode("Could not find bids for auction.", 422));
  }

  res.json({ bids: bids.toObject({ getters: true }) });
};

const getBidsByAuction = async (req, res, next) => {
  const auctionId = req.params.auctionID;

  let bids;
  try {
    bids = await Bid.find({ auction: auctionId });
  } catch (err) {}

  if (!bids | (bids.length <= 0)) {
    return next(new ErrorWithCode("Could not find bids for auction.", 422));
  }

  res.json({ bids: bids.toObject({ getters: true }) });
};

const getBid = async (req, res, next) => {
  const bidId = req.params.bidID;

  let bid;
  try {
    bid = await Bid.findById(bidId);
  } catch (error) {
    return next(new ErrorWithCode("Could not retrieve bid. Try again later."));
  }

  if (!bid) {
    return next(new ErrorWithCode("Could not find a bid with ID.", 422));
  }

  res.json({ bid: bid.toObject({ getters: true }) });
};

const updateBid = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode(
        "Inputs are invalid. Please check before trying again.",
        422
      )
    );
  }

  const bidId = req.params.bidID;
  const { value, description, timeEstimation } = req.body;

  let bid;
  try {
    bid = await Bid.findById(bidId);
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retreive bid. Please try again.", 500)
    );
  }

  if (!bid) {
    return next(new ErrorWithCode("Could not find a bid with ID.", 422));
  }

  bid.value = value;
  bid.description = description;
  bid.timeEstimation = timeEstimation;
  bid.lastChange = Date.now();

  try {
    await bid.save();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not update auction. Please try again.", 500)
    );
  }

  res.json({ bid: bid.toObject({ getters: true }) });
};

const deleteBid = async (req, res, next) => {
  const bidId = req.params.bidID;

  let bid;
  try {
    bid = await Bid.findById(bidId)
      .populate("creator")
      .populate("auction")
      .exec();
  } catch (err) {
    return next(new ErrorWithCode("Could not delete bid.", 500));
  }

  if (!bid) {
    return next(new ErrorWithCode("Could not find bid to remove!", 422));
  }

  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    await bid.deleteOne({ session: mongooseSession });

    bid.creator.bids.pull(bid);
    await bid.creator.save({ session: mongooseSession });

    bid.auction.bids.pull(bid);
    await bid.auction.save({ session: mongooseSession });

    await mongooseSession.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new ErrorWithCode("Could not delete bid.", 500));
  }
  res.json({ message: "Bid removed" });
};

exports.createBidForUser = createBidForUser;
exports.getBidsByUser = getBidsByUser;
exports.getBidsByAuction = getBidsByAuction;
exports.getBid = getBid;
exports.updateBid = updateBid;
exports.deleteBid = deleteBid;

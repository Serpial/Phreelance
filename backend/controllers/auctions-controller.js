const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const ErrorWithCode = require("../models/error-with-code");
const Auction = require("../models/data/auction");
const User = require("../models/data/user");
const Bid = require("../models/data/bid");

const getAuctions = async (req, res, next) => {
  let publicAuctions;
  try {
    publicAuctions = await Auction.find({ isPublic: true });
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve auctions", 404));
  }

  if (!publicAuctions || publicAuctions.length == 0) {
    return next(
      new ErrorWithCode("There are no public auctions at this time", 422)
    );
  }

  res.json({
    auctions: publicAuctions.map((a) => a.toObject({ getters: true })),
  });
};

const getAuctionById = async (req, res, next) => {
  const auctionId = req.params.auctionID;

  let auction;
  try {
    auction = await Auction.findById(auctionId);
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retrieve auction. Try again later.")
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  res.json({ auction: auction.toObject({ getters: true }) });
};

const getUserCreatedAuctions = async (req, res, next) => {
  const userId = req.params.userID;

  let auctions;
  try {
    auctions = await Auction.find({ creator: userId });
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve auctions", 404));
  }

  if (!auctions || auctions.length === 0) {
    return next(
      new ErrorWithCode("Could not find any auctions by this user.", 422)
    );
  }

  res.json({ auctions: auctions.map((a) => a.toObject({ getters: true })) });
};

const createAuction = async (req, res, next) => {
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
  const {
    title,
    description,
    attachments,
    auctionType,
    isPublic,
    isSealed,
    starting,
    finishing,
  } = req.body;

  const creationTime = Date.now();
  const startTime = starting ? Date.parse(starting) : creationTime;
  const finishTime = Date.parse(finishing);

  // 86400 seconds in a 24 hours
  if (finishTime < startTime + 86400 || startTime < creationTime) {
    return next(
      new ErrorWithCode("Time constraints not formatted correctly.", 422)
    );
  }

  const newAuction = new Auction({
    title,
    description,
    attachments,
    auctionType,
    isPublic: isPublic || false,
    isSealed: isSealed || false,
    creator: userId,
    created: creationTime,
    starting: startTime,
    finishing: finishTime,
    bids: [],
  });

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new ErrorWithCode("Could not create auction. Please try again.", 404)
    );
  }

  if (!user) {
    return next(new ErrorWithCode("Could not find user with ID.", 422));
  }

  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    await newAuction.save({ session: mongooseSession });

    user.auctions.push(newAuction);
    await user.save({ session: mongooseSession });

    await mongooseSession.commitTransaction();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not create auction. Please try again.", 500)
    );
  }

  res.status(201).json({ auction: newAuction.toObject({ getters: true }) });
};

const updateAuction = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode(
        "Inputs are invalid. Please check before trying again.",
        422
      )
    );
  }

  const auctionId = req.params.auctionID;
  const { title, description, attachments, isPublic, starting, finishing } =
    req.body;

  let auction;
  try {
    auction = await Auction.findById(auctionId);
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retreive auction. Please try again.", 500)
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  auction.title = title;
  auction.description = description;
  auction.attachments = attachments;
  auction.isPublic = isPublic;
  auction.starting = starting;
  auction.finishing = finishing;

  try {
    await auction.save();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not update auction. Please try again.", 500)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const deleteAuction = async (req, res, next) => {
  const auctionId = req.params.auctionID;

  let auction;
  try {
    auction = await Auction.findById(auctionId)
      .populate("creator")
      .populate("bids")
      .exec();
  } catch (err) {
    console.log(err);
    return next(
      new ErrorWithCode("Could not delete auction. Please try again.", 500)
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not delete item with that ID.", 422));
  }

  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    await auction.deleteOne({ session: mongooseSession });

    auction.creator.auctions.pull(auction);
    await auction.creator.save({ session: mongooseSession });

    await Bid.deleteMany({ auction: auction }, { session: mongooseSession });

    await mongooseSession.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new ErrorWithCode("Could not delete auction. Please try again later", 500)
    );
  }

  res.json({ message: "Auction deleted!" });
};

exports.getAuctions = getAuctions;
exports.getAuctionById = getAuctionById;
exports.getUserCreatedAuctions = getUserCreatedAuctions;
exports.createAuction = createAuction;
exports.updateAuction = updateAuction;
exports.deleteAuction = deleteAuction;

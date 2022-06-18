const { validationResult } = require("express-validator");

const ErrorWithCode = require("../models/error-with-code");
const Bid = require("../models/data/bid");
const User = require("../models/data/user");
const Auction = require("../models/data/auction");

/**
 * @apiGroup Bids
 * @apiDescription
 * Creates a new bid for the user.
 *
 * @returns Bid
 * @api {post} /bids/create/:auctionID/:userID Create bid
 * @apiParam auctionID Unique ID for the auction in which the bid is to be
 * placed.
 * @apiParam userID Unique ID for user that is placing the bid.
 * @apiBody {Number} value The proposed bid value.
 * @apiBody {String} description A description of the work to be done.
 * @apiBody {String} timeEstimation A time estimation for the work to be done
 * e.g. 3 days or 4 months.
 */
const createBidForUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new ErrorWithCode(
        "Inputs are invalid. Please check before trying again.",
        422
      )
    );
  }

  const userId = req.params.userID;
  const auctionId = req.params.auctionID.split("-");
  const auctionDbId = auctionId[auctionId.length - 1];
  const { value, description, timeEstimation } = req.body;

  const newBid = new Bid({
    value,
    description,
    timeEstimation,
    creator: userId,
    auction: auctionDbId,
    created: Date.now(),
    lastChange: Date.now(),
  });

  let user, auction, bids, existingBids;
  try {
    user = await User.findById(userId);
    auction = await Auction.findById(auctionDbId);
    bids = await Bid.find({ auction: auction.id });
    existingBids = await Bid.find({ auction: auction.id, creator: user.id });
  } catch (err) {
    return next(
      new ErrorWithCode("Could not create bid. Please try again.", 404)
    );
  }

  if (!user || !auction || !existingBids || !bids) {
    return next(
      new ErrorWithCode(
        "Could not retrieve user or auction. Please try again.",
        422
      )
    );
  }

  if (newBid.value > auction.reservePrice) {
    return next(
      new ErrorWithCode("Your bid is greater than the reserve price.", 422)
    );
  }

  if (bids.length > 0) {
    const minBidValue = Math.min(...bids.map((b) => b.value));
    const winningBid = bids.find((b) => b.value === minBidValue);
    if (newBid.value >= winningBid.value) {
      return next(
        new ErrorWithCode(
          "Your bid is greater than the current winning bid",
          422
        )
      );
    }
  }

  if (auction.creator.toString() === user.id) {
    return next(
      new ErrorWithCode("Creator cannot bid on their own auction", 422)
    );
  }

  if (existingBids.length > 0) {
    return next(
      new ErrorWithCode(
        "Bid already exists for this user in this auction. Please use patch.",
        422
      )
    );
  }

  if (auction.auctionType === "DUT") {
    // Close dutch auction if successful bid.
    auction.finishing = Date.now();
  } else if (auction.auctionType === "ENG") {
    // Add two hours if we are close to the end of the auction to give users
    // time to counter-bid.
    const twoHours = 60 * 60 * 2 * 1000;
    const finishingDate = new Date(auction.finishing);
    if (new Date().getTime() > finishingDate.getTime() - twoHours) {
      auction.finishing = finishingDate.getTime() + twoHours;
    }
  }

  let bidsForAuction;
  try {
    bidsForAuction = await Bid.find({ auction: auction.id });
  } catch (err) {
    return new ErrorWithCode("Could not fetch auction with ID.", 422);
  }

  if (bidsForAuction.length > 0) {
    const minValue = Math.min(bidsForAuction.map((b) => b.value));
    if (minValue > 0 && value >= minValue) {
      return new ErrorWithCode("Bid is not lower than current offer.", 422);
    }
  }

  try {
    await newBid.save();
    await auction.save();
  } catch (err) {
    if (err.responseCode) {
      return next(err);
    }
    return next(
      new ErrorWithCode("Could not complete creation transaction.", 500)
    );
  }
  res.status(201).json({ bid: newBid.toObject({ getters: true }) });
};

/**
 * @apiGroup Bids
 * @apiDescription
 * Get bids created by a user given user ID.
 *
 * @returns List of Bids
 * @api {get} /bids/user/:userID Get all bids from user
 * @apiParam userID Unique ID of the user
 */
const getBidsByUser = async (req, res, next) => {
  const userId = req.params.userID;

  let bids;
  try {
    bids = await Bid.find({ creator: userId });
  } catch (_err) {
    return next(new ErrorWithCode("Could not retrieve bids. Try again.", 422));
  }

  res.json({ bids: bids.map((a) => a.toObject({ getters: true })) });
};

/**
 * @apiGroup Bids
 * @apiDescription
 * Get bids for a specific auction.
 *
 * @returns List of Bids
 * @api {get} /bids/auction/:auctionID Get all bids for a auction.
 * @apiParam auctionID Unique ID of the auction
 */
const getBidsByAuction = async (req, res, next) => {
  const auctionId = req.params.auctionID.split("-");
  const auctionDbId = auctionId[auctionId.length - 1];

  let bids;
  try {
    bids = await Bid.find({ auction: auctionDbId });
  } catch (_err) {
    return next(new ErrorWithCode("Could not retrieve bids. Try again.", 422));
  }

  res.json({ bids: bids.map((a) => a.toObject({ getters: true })) });
};

/**
 * @apiGroup Bids
 * @apiDescription
 * Get specific bid given its ID.
 *
 * @returns Bid
 * @api {get} /bids/:bidID Get Bid
 * @apiParam bidID Unique ID of the bid
 */
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

/**
 * @apiGroup Bids
 * @apiDescription
 * Update the bid with new values.
 *
 * @returns Bid
 * @api {patch} /bids/:bidID Update Bid
 * @apiParam bidID Bid that you wish to modify.
 * @apiBody {Number} value The proposed bid value.
 * @apiBody {String} description A description of the work to be done.
 * @apiBody {String} timeEstimation A time estimation for the work to be done
 * e.g. 3 days or 4 months.
 */
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

  let bid, auction;
  try {
    bid = await Bid.findById(bidId).populate("auction");
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retrieve bid. Please try again.", 500)
    );
  }

  if (!bid) {
    return next(new ErrorWithCode("Could not find a bid with ID.", 422));
  }

  if (bid.auction.auctionType === "ENG") {
    // Add two hours if we are close to the end of the auction to give users
    // time to counter-bid.
    const twoHours = 60 * 60 * 2 * 1000;
    const finishingDate = new Date(bid.auction.finishing);
    if (finishingDate.getTime() - twoHours > new Date().getTime()) {
      bid.auction.finishing = finishingDate.getTime() + twoHours;
    }
  }

  let bidsForAuction;
  try {
    bidsForAuction = await Bid.find({ auction: bid.auction.id });
  } catch (err) {
    return new ErrorWithCode("Could not fetch auction with ID.", 422);
  }

  if (bidsForAuction.length > 0 && bid) {
    const minValue = Math.min(bidsForAuction.map((b) => b.value));
    if (minValue > 0 && value >= minValue && bid.value !== minValue) {
      return new ErrorWithCode("Bid is not lower than current offer.", 422);
    }
  }

  bid.value = value;
  bid.description = description;
  bid.timeEstimation = timeEstimation;
  bid.lastChange = Date.now();

  try {
    await bid.save();
  } catch (err) {
    if (err.responseCode) {
      return next(err);
    }
    return next(
      new ErrorWithCode("Could not update auction. Please try again.", 500)
    );
  }

  res.json({ bid: bid.toObject({ getters: true }) });
};

/**
 * @apiGroup Bids
 * @apiDescription
 * Get list winning bids for auctions that the user has won.
 *
 * @returns List of Bids
 * @api {get} /winning-bids/user/:userID Getting winning bids by user
 * @apiParam userID User that you wish to retrieve the winning bids of.
 */
const getWinningBidsByUser = async (req, res, next) => {
  const userId = req.params.userID;

  let bids;
  try {
    bids = await Bid.find({ creator: userId }).populate("auction");
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve bids. Try again.", 422));
  }

  const winningBids = [];
  const participatingAuctions = bids.map((b) => b.auction);
  for (const auction of participatingAuctions) {
    try {
      const auctionBids = await Bid.find({ auction: auction.id });
      const minBidValue = Math.min(...auctionBids.map((b) => b.value));
      const bid = auctionBids.find((b) => b.value === minBidValue);
      if (
        bid.creator.toString() === userId &&
        new Date(auction.finishing).getTime() < new Date().getTime()
      ) {
        winningBids.push(bid);
      }
    } catch (err) {
      return next(
        new ErrorWithCode("Could not retrieve bids. Try again.", 422)
      );
    }
  }

  res.json({ bids: winningBids.map((a) => a.toObject({ getters: true })) });
};

/**
 * @apiGroup Bids
 * @apiDescription
 * Get the winning bid for a particular auction.
 *
 * @returns Bid
 * @api {get} /top-bid/:auctionID Getting top bid for auction
 * @apiParam auctionID Unique ID for the target auction.
 */
const getTopBidPerAuction = async (req, res, next) => {
  const auctionId = req.params?.auctionID.split("-");
  const auctionDbId = auctionId[auctionId?.length - 1];

  let bids;
  try {
    bids = await Bid.find({ auction: auctionDbId });
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve bids. Try again.", 422));
  }

  if (bids?.length === 0) {
    res.json({ message: "No bids on auction." });
    return next();
  }

  const minBidValue = Math.min(...bids.map((b) => b.value));
  const bid = bids.find((b) => b.value === minBidValue);
  res.json({ bid: bid.toObject({ getter: true }) });
};

exports.getBidsByUser = getBidsByUser;
exports.createBidForUser = createBidForUser;
exports.getWinningBidsByUser = getWinningBidsByUser;
exports.getBidsByAuction = getBidsByAuction;
exports.getTopBidPerAuction = getTopBidPerAuction;
exports.getBid = getBid;
exports.updateBid = updateBid;

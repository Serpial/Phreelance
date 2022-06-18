const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const ErrorWithCode = require("../models/error-with-code");
const Auction = require("../models/data/auction");
const User = require("../models/data/user");
const Bid = require("../models/data/bid");

/**
 * @apiGroup Auctions
 * @apiDescription
 * Gets a list of all public auctions.
 *
 * Also the consumer may interact with the API call by applying filter options
 * that allow them to refine their search based their requirements.
 *
 * @return List of Auctions
 *
 * @api {get} /auctions Get auctions
 * @apiBody {Boolean} sortOldest Sort by oldest, inverse of newest
 * @apiBody {Boolean} sortNewest Sort by newest, inverse of oldest
 * @apiBody {String} searchString Check is string is within auction
 * title or description
 * @apiBody {Boolean} showPending Show pending auctions
 * @apiBody {Boolean} showStarted Show started auctions
 * @apiBody {Boolean} showClosed Show closed auctions
 */
const getAuctions = async (req, res, next) => {
  const {
    sortOldest,
    sortNewest,
    searchString,
    showPending,
    showStarted,
    showClosed,
  } = req.query;

  try {
    publicAuctions = await Auction.find({ isPublic: true }).sort({
      starting: sortOldest === "true" && sortNewest === "false" ? 1 : -1,
    });
  } catch (_err) {
    return next(new ErrorWithCode("Could not retrieve auctions", 404));
  }

  if (!publicAuctions || publicAuctions.length === 0) {
    return next(
      new ErrorWithCode("There are no public auctions at this time", 200)
    );
  }

  if (searchString && searchString !== "") {
    const regex = new RegExp(searchString, "gi");
    publicAuctions = publicAuctions.filter(
      (a) => regex.test(a.title) || regex.test(a.description)
    );
  }

  publicAuctions = publicAuctions.filter((a) => {
    const start = Date.parse(a.starting);
    const close = Date.parse(a.finishing);
    const now = Date.now();

    if (showPending === "false" && now < start) {
      return false;
    }

    if (showStarted === "false" && now > start && now < close) {
      return false;
    }

    if (showClosed === "false" && now > close) {
      return false;
    }
    return true;
  });

  return res.json({
    auctions: publicAuctions,
  });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Given a userID, this method gets the auctions that the user is actually
 * participating in.
 *
 * @returns List of Auctions
 *
 * @api {get} /auctions/bidder/:userID Get participating auctions
 * @apiParam userID Unique user ID.
 */
const getParticipatingAuctions = async (req, res, next) => {
  const userId = req.params.userID;

  let bids;
  try {
    bids = await Bid.find({ creator: userId }).populate("auction");
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve bids. Try again later."));
  }

  const auctions = bids.map((b) => b.auction);

  return res.json({
    auctions: auctions,
  });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Get specific auction by its meaningful ID.
 * That is in the format: name-ID
 * e.g. "a-name-D6H8GGR9"
 *
 * @returns Auction
 *
 * @api {get} /auctions/:auctionID Get auction by ID
 * @apiParam auctionID Unique auction ID
 */
const getAuctionById = async (req, res, next) => {
  const auctionId = req.params.auctionID;

  let auction;
  try {
    auction = await Auction.findOne({ meaningfulId: auctionId });
    if (!auction) {
      auction = await Auction.findById(auctionId);
    }
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retrieve auction. Try again later.")
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  res.json({ auction: auction });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Get auctions creator by the specific user via user ID
 *
 * @returns List of auctions
 *
 * @api {get} /creator/:auctionID Get user created auctions
 * @apiParam auctionID Unique auction ID.
 */
const getUserCreatedAuctions = async (req, res, next) => {
  const userId = req.params.userID;

  let auctions;
  try {
    auctions = await Auction.find({ creator: userId });
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve auctions", 404));
  }

  if (!auctions) {
    return next(
      new ErrorWithCode("Could not find any auctions by this user.", 422)
    );
  }

  res.json({ auctions: auctions.map((a) => a.toObject({ getters: true })) });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Create a new auction. This method validates all of the information provided
 * before submitting it to the database.
 *
 * @returns Auction
 *
 * @api {post} /auctions/:userID Create auction
 * @apiParam userID Unique user ID.
 * @apiBody {String} title Title of auction
 * @apiBody {String} description Description of auction
 * @apiBody {Boolean} isPublic Has the auction been submitted as a public or
 * a draft
 * @apiBody {Number} reservePrice Reserve price for the auction.
 * @apiBody {Number} startingPrice Starting price for the auction.
 * @apiBody {String} starting Start time for the auction in UTC.
 * @apiBody {String} finishing Finish time for the auction in UTC.
 */
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
    auctionType,
    isPublic,
    reservePrice,
    startingPrice,
    starting,
    finishing,
  } = req.body;

  const creationTime = Date.now();
  const startTime = starting ? Date.parse(starting) + 60000 : creationTime;
  const finishTime = Date.parse(finishing);

  if (!dateIsWithinOfRange(creationTime, startTime, finishTime)) {
    return next(new ErrorWithCode("Time constraint is not within range.", 422));
  }

  if (auctionType == "DUT" && reservePrice <= startingPrice) {
    return next(
      new ErrorWithCode(
        "Could not create an auction where the starting price is less than the reserve price.",
        422
      )
    );
  }

  const newAuction = new Auction({
    title,
    description,
    auctionType,
    reservePrice,
    startingPrice,
    isPublic: isPublic || false,
    creator: userId,
    created: creationTime,
    starting: startTime,
    finishing: finishTime,
  });

  const meaningfulId =
    title.split(" ").splice(0, 5).join("-").toLowerCase() + "-" + newAuction.id;
  newAuction.meaningfulId = meaningfulId;

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
    await newAuction.save();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not create auction. Please try again.", 500)
    );
  }

  res.status(201).json({ auction: newAuction });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Update selected auction values.
 *
 * @returns Auction
 *
 * @api {patch} /auctions/:auctionID Update auction
 * @apiParam auctionID Unique auction ID.
 * @apiBody {String} description Description of auction
 * @apiBody {Boolean} isPublic Has the auction been submitted as a public or
 * a draft
 * @apiBody {Number} reservePrice Reserve price for the auction.
 * @apiBody {Number} startingPrice Starting price for the auction.
 * @apiBody {String} starting Start time for the auction in UTC.
 * @apiBody {String} finishing Finish time for the auction in UTC.
 */
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
  const {
    description,
    isPublic,
    reservePrice,
    startingPrice,
    starting,
    finishing,
  } = req.body;

  let auction;
  try {
    auction = await Auction.findOne({ meaningfulId: auctionId });
  } catch (err) {
    return next(
      new ErrorWithCode("Could not retrieve auction. Please try again.", 500)
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  if (auction.auctionType == "DUT" && startingPrice <= reservePrice) {
    return next(
      new ErrorWithCode(
        "Could not create an auction where the starting price is less than the reserve price.",
        422
      )
    );
  }

  const creationTime = new Date(auction.created).getTime();
  const startTime = new Date(starting ?? auction.starting);
  const finishTime = new Date(finishing ?? auction.finishing);
  if (
    !dateIsWithinOfRange(
      creationTime,
      startTime.getTime(),
      finishTime.getTime()
    )
  ) {
    return next(new ErrorWithCode("Time constraint is not within range.", 422));
  }

  auction.description = description;
  auction.isPublic = isPublic;
  auction.starting = startTime;
  auction.finishing = finishTime;
  auction.reservePrice = reservePrice ?? auction.reservePrice;
  auction.startingPrice = startingPrice ?? auction.startingPrice;

  try {
    await auction.save();
  } catch (err) {
    console.log(err);
    return next(
      new ErrorWithCode("Could not update auction. Please try again.", 500)
    );
  }
  res.json({ auction: auction });
};

/**
 * @apiGroup Auctions
 * @apiDescription
 * Delete this auction. Auctions may only be deleted if they are public.
 *
 * @returns message that the auction is deleted
 * @api {delete} /auctions/:auctionID Delete auction
 * @apiParam auctionID Unique auction ID.
 */
const deleteAuction = async (req, res, next) => {
  const auctionId = req.params.auctionID;

  let auction;
  try {
    auction = await Auction.findOne({ meaningfulId: auctionId });
  } catch (err) {
    return next(
      new ErrorWithCode("Could not delete auction. Please try again.", 500)
    );
  }

  if (!auction) {
    return next(new ErrorWithCode("Could not delete item with that ID.", 422));
  }

  if (auction.isPublic) {
    return next(
      new ErrorWithCode(
        "Could not delete an auction after it has been public",
        500
      )
    );
  }

  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    await auction.deleteOne({ session: mongooseSession });
    await Bid.deleteMany({ auction: auction }, { session: mongooseSession });
    await mongooseSession.commitTransaction();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not delete auction. Please try again later", 500)
    );
  }

  res.json({ message: "Auction deleted!" });
};

/**
 * Helper method that uses the epoch number of the start and finish time to find
 * out if the dates are valid, given set conditions.
 *
 * @param {Number} creation
 * @param {Number} start
 * @param {Number} finish
 * @returns True or False based on validity
 */
const dateIsWithinOfRange = (creation, start, finish) => {
  const day = 86400000;
  const threeMonths = 8035200000;
  const year = 31622400000;

  const startIsWithinThreeMonths = start < creation + threeMonths;
  const startIsNotBeforeCreation = start >= creation;
  const auctionLengthIsAtLeastADay = start + day < finish;
  const finishTimeIsWithinAYear = finish < start + year;

  return (
    startIsWithinThreeMonths &&
    startIsNotBeforeCreation &&
    auctionLengthIsAtLeastADay &&
    finishTimeIsWithinAYear
  );
};

exports.getAuctions = getAuctions;
exports.getAuctionById = getAuctionById;
exports.getParticipatingAuctions = getParticipatingAuctions;
exports.getUserCreatedAuctions = getUserCreatedAuctions;
exports.createAuction = createAuction;
exports.updateAuction = updateAuction;
exports.deleteAuction = deleteAuction;

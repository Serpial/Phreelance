const ErrorWithCode = require("../models/error-with-code");

let DUMMY_AUCTIONS = [
  {
    auctionId: "a1",
    title: "Work contract",
    description: "A basic work contract",
    attachments: ["http://www.africau.edu/images/default/sample.pdf"],
    auctionType: "eng",
    isPublic: true,
    isSealed: false,
    creator: "u1",
    created: Date.now(),
    starting: Date.parse("01 Feb 2022 06:30:00 GMT"),
    finishing: Date.parse("05 Feb 2022 18:30:00 GMT"),
    bidders: ["u2", "u3", "u4"],
  },
];

const getAuctions = (req, res, next) => {
  res.json(DUMMY_AUCTIONS.filter((a) => a.isPublic === true));
};

const getAuctionById = (req, res, next) => {
  const auctionId = req.params.auctionID;

  const auction = DUMMY_AUCTIONS.find((a) => a.auctionId === auctionId);

  if (!auction) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  res.json(auction);
};

const createAuction = (req, res, next) => {
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

  const newAuction = {
    auctionId: "tempID",
    title,
    description,
    attachments,
    auctionType,
    isPublic,
    isSealed,
    creator: userId,
    created: Date.now(),
    starting: Date.parse(starting),
    finishing: Date.parse(finishing),
    bidders: [],
  };

  DUMMY_AUCTIONS.push(newAuction);
  res.json(newAuction);
};

const updateAuction = (req, res, next) => {
  const auctionId = req.params.auctionID;
  const index = DUMMY_AUCTIONS.findIndex((a) => a.auctionId === auctionId);

  if (index === -1) {
    return next(new ErrorWithCode("Could not find auction with ID.", 422));
  }

  const { title, description, attachments, isPublic, starting, finishing } =
    req.body;

  const updatedAuction = {
    ...DUMMY_AUCTIONS[index],
    title,
    description,
    attachments,
    isPublic,
    starting,
    finishing,
  };

  DUMMY_AUCTIONS[index] = updatedAuction;
  res.json(DUMMY_AUCTIONS[index]);
};

const deleteAuction = (req, res, next) => {
  const auctionId = req.params.auctionID;

  var index = DUMMY_AUCTIONS.findIndex((a) => a.auctionId === auctionId);

  if (index < 0) {
    return next(new ErrorWithCode("Could not delete item with that ID.", 422));
  }

  DUMMY_AUCTIONS.splice(index, 1);
  res.json({ message: "Auction deleted" });
};

const getUserCreatedAuctions = (req, res, next) => {
  const userId = req.params.userID;

  const auctions = DUMMY_AUCTIONS.filter((a) => a.creator === userId);

  if (auctions.length === 0) {
    return next(
      new ErrorWithCode("Could not find any auctions by this user.", 422)
    );
  }

  res.json(auctions);
};

exports.getAuctions = getAuctions;
exports.getAuctionById = getAuctionById;
exports.createAuction = createAuction;
exports.updateAuction = updateAuction;
exports.deleteAuction = deleteAuction;
exports.getUserCreatedAuctions = getUserCreatedAuctions;

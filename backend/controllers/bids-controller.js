const ErrorWithCode = require("../models/error-with-code");

const DUMMY_BIDS = [
  {
    bidId: "b1",
    auctionId: "a1",
    value: 0.01,
    description: "I would like to do the work in this direction",
    timeEstimation: 10,
    creator: "u2",
    created: Date.now(),
    lastChange: Date.now(),
  },
];

const getBidsByUser = (req, res, next) => {
  const userId = req.params.userID;
  const bids = DUMMY_BIDS.filter((b) => b.creator === userId);

  if (bids.length < 1) {
    return next(
      new ErrorWithCode(
        "Could not find any bids active created by this user",
        422
      )
    );
  }

  res.json(bids);
};

const createBidForUser = (req, res, next) => {
  const userId = req.params.userID;

  const { auctionId, value, description, timeEstimation } = req.body;

  const newBid = {
    bidId: "b2",
    auctionId,
    value,
    description,
    timeEstimation,
    creator: userId,
    created: Date.now(),
    lastChange: Date.now(),
  };

  DUMMY_BIDS.push(newBid);
  res.json(newBid);
};

const getBidsByAuction = (req, res, next) => {
  const auctionId = req.params.auctionID;

  const bids = DUMMY_BIDS.filter((b) => b.auctionId === auctionId);

  if (bids.length <= 0) {
    return next(new ErrorWithCode("Could not find bids for auction.", 422));
  }

  res.json(bids);
};

const getBid = (req, res, next) => {
  const bidId = req.params.bidID;
  const bid = DUMMY_BIDS.find((b) => b.bidId === bidId);

  if (!bid) {
    return next(new ErrorWithCode("Could not find a bid with ID.", 422));
  }

  res.json(bid);
};

const updateBid = (req, res, next) => {
  const bidId = req.params.bidID;
  const index = DUMMY_BIDS.findIndex((b) => b.bidId === bidId);

  if (index < 0) {
    return next(new ErrorWithCode("Could not find a bid with ID.", 422));
  }

  const { value, description, timeEstimation } = req.body;
  const updatedBid = {
    ...DUMMY_BIDS[index],
    value,
    description,
    timeEstimation,
    lastChange: Date.now(),
  };

  DUMMY_BIDS[index] = updatedBid;
  res.json(DUMMY_BIDS[index]);
};

const deleteBid = (req, res, next) => {
  const bidId = req.params.bidID;

  const index = DUMMY_BIDS.findIndex((b) => b.bidId === bidId);
  if (index < 0) {
    return next(new ErrorWithCode("Could not find bid to remove!", 422));
  }

  DUMMY_BIDS.splice(index, 1);
  res.json({ message: "Bid removed" });
};

exports.getBidsByUser = getBidsByUser;
exports.createBidForUser = createBidForUser;
exports.getBidsByAuction = getBidsByAuction;
exports.getBid = getBid;
exports.updateBid = updateBid;
exports.deleteBid = deleteBid;

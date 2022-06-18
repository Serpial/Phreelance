const express = require("express");
const { check } = require("express-validator");

const bidsController = require("../controllers/bids-controller");

const router = express.Router();

router.get("/user/:userID", bidsController.getBidsByUser);
router.get("/auction/:auctionID", bidsController.getBidsByAuction);
router.get("/top-bid/:auctionID", bidsController.getTopBidPerAuction);
router.get("/winning-bids/user/:userID", bidsController.getWinningBidsByUser);
router.get("/:bidID", bidsController.getBid);

router.post(
  "/create/:auctionID/:userID",
  [
    check("value").isFloat({ min: 0.01 }),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isString(),
  ],
  bidsController.createBidForUser
);
router.patch(
  "/:bidID",
  [
    check("value").isFloat({ min: 0.01 }),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isString(),
  ],
  bidsController.updateBid
);

module.exports = router;

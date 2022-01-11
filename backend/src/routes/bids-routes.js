const express = require("express");
const { check } = require("express-validator");

const bidsController = require("../controllers/bids-controller");

const router = express.Router();

router.get("/user/:userID", bidsController.getBidsByUser);
router.get("/auction/:auctionID", bidsController.getBidsByAuction);
router.get("/:bidID", bidsController.getBid);

router.post(
  "/create/:auctionID/:userID",
  [
    check("value").isFloat({ min: 0.01 }),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isInt({ min: 1 }),
  ],
  bidsController.createBidForUser
);
router.patch(
  "/:bidID",
  [
    check("value").isFloat({ min: 0.01 }),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isInt({ min: 1 }),
  ],
  bidsController.updateBid
);
router.delete("/:bidID", bidsController.deleteBid);

module.exports = router;

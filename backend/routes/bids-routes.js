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
    check("value").isNumeric(),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isInt(),
  ],
  bidsController.createBidForUser
);
router.patch(
  "/:bidID",
  [
    check("value").isNumeric(),
    check("description").isLength({ min: 10 }),
    check("timeEstimation").isInt(),
  ],
  bidsController.updateBid
);
router.delete("/:bidID", bidsController.deleteBid);

module.exports = router;

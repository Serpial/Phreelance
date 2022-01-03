const express = require("express");

const bidsController = require("../controllers/bids-controller");

const router = express.Router();

router.get("/user/:userID", bidsController.getBidsByUser);
router.post("/create/:userID", bidsController.createBidForUser);
router.get("/auction/:auctionID", bidsController.getBidsByAuction);
router.get("/:bidID", bidsController.getBid);
router.patch("/:bidID", bidsController.updateBid);
router.delete("/:bidID", bidsController.deleteBid);

module.exports = router;
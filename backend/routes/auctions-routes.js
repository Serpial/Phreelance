const express = require("express");

const auctionsController = require("../controllers/auctions-controller");

const router = express.Router();

router.get("/", auctionsController.getAuctions);
router.post("/:userID", auctionsController.createAuction);

router.get("/:auctionID", auctionsController.getAuctionById);
router.patch("/:auctionID", auctionsController.updateAuction);
router.delete("/:auctionID", auctionsController.deleteAuction);

router.get("/creator/:userID", auctionsController.getUserCreatedAuctions);

module.exports = router;

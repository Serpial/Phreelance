const express = require("express");
const { check, oneOf } = require("express-validator");

const auctionsController = require("../controllers/auctions-controller");
const dateTimeValidator = require("./util/date-time-validator");

const router = express.Router();

router.get("/", auctionsController.getAuctions);
router.get("/:auctionID", auctionsController.getAuctionById);
router.get("/creator/:userID", auctionsController.getUserCreatedAuctions);
router.get("/bidder/:userID", auctionsController.getParticipatingAuctions);

router.post(
  "/:userID",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 10 }),
    oneOf([
      check("auctionType").equals("ENG"),
      check("auctionType").equals("DUT"),
    ]),
    check("reservePrice").isNumeric({ min: 0 }),
    check("startingPrice").isNumeric({ min: 0 }),
    oneOf([
      check("starting").custom(dateTimeValidator),
      check("starting").isEmpty(),
    ]),
    check("finishing").custom(dateTimeValidator),
  ],
  auctionsController.createAuction
);

router.patch(
  "/:auctionID",
  [
    check("description").isLength({ min: 10 }),
    check("finishing").custom(dateTimeValidator),
    oneOf([
      check("reservePrice").isNumeric({ min: 0 }),
      check("reservePrice").isEmpty(),
    ]),
    oneOf([
      check("startingPrice").isNumeric({ min: 0 }),
      check("startingPrice").isEmpty(),
    ]),
    oneOf([
      check("starting").custom(dateTimeValidator),
      check("starting").isEmpty(),
    ]),
  ],
  auctionsController.updateAuction
);

router.delete("/:auctionID", auctionsController.deleteAuction);

module.exports = router;

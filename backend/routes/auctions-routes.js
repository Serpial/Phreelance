const express = require("express");
const { check, oneOf } = require("express-validator");

const auctionsController = require("../controllers/auctions-controller");
const dateTimeValidator = require("../util/date-time-validator");

const router = express.Router();

router.get("/", auctionsController.getAuctions);
router.get("/:auctionID", auctionsController.getAuctionById);
router.get("/creator/:userID", auctionsController.getUserCreatedAuctions);

router.post(
  "/:userID",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 10 }),
    oneOf([
      check("auctionType").equals("eng"),
      check("auctionType").equals("dut"),
    ]),
    check("starting").custom((input, meta) => dateTimeValidator(input)),
    check("finishing").custom((input, meta) => dateTimeValidator(input)),
  ],
  auctionsController.createAuction
);

router.patch(
  "/:auctionID",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 10 }),
    oneOf([
      check("auctionType").equals("eng"),
      check("auctionType").equals("dut"),
    ]),
    check("starting").custom((input, meta) => dateTimeValidator(input)),
    check("finishing").custom((input, meta) => dateTimeValidator(input)),
  ],
  auctionsController.updateAuction
);

router.delete("/:auctionID", auctionsController.deleteAuction);

module.exports = router;

const express = require("express");
const { check, oneOf } = require("express-validator");

const auctionsController = require("../controllers/auctions-controller");
const dateTimeValidator = require("./util/date-time-validator");

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
    oneOf([
      check("starting").custom((input, _meta) => dateTimeValidator(input)),
      check("starting").isEmpty(),
    ]),
    check("finishing").custom((input, _meta) => dateTimeValidator(input)),
  ],
  auctionsController.createAuction
);

router.patch(
  "/:auctionID",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 10 }),
    check("finishing").custom((input, _meta) => dateTimeValidator(input)),
    oneOf([
      check("auctionType").equals("eng"),
      check("auctionType").equals("dut"),
    ]),
    oneOf([
      check("starting").custom((input, _meta) => dateTimeValidator(input)),
      check("starting").isEmpty(),
    ]),
  ],
  auctionsController.updateAuction
);

router.delete("/:auctionID", auctionsController.deleteAuction);

module.exports = router;

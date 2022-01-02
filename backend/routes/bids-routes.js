const express = require("express");

const router = express.Router();

router.get("/:userID");
router.post("/:userID");
router.patch("/:userID");
router.delete("/:userID");

router.get("/auction/:auctionID");

module.exports = router;
const express = require("express");

const router = express.Router();

router.post("/signup");
router.post("/login");
router.delete("/:userID");
router.patch("/:userID");

module.exports = router;
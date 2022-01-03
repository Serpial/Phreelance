const express = require("express");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.post("/signup", usersController.createUser);
router.post("/login", usersController.loginUser);

module.exports = router;
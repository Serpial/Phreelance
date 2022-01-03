const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("password").notEmpty(),
  ],
  usersController.createUser
);
router.post(
  "/login",
  [check("email").isEmail(), check("password").notEmpty()],
  usersController.loginUser
);

module.exports = router;

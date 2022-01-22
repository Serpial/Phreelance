const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("authId").notEmpty(),
  ],
  usersController.createUser
);

module.exports = router;

const express = require("express");
const { check, oneOf } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/:appID", usersController.getUserByAppId);
router.get("/auth/:authID", usersController.getUserByAuthId);

router.post(
  "/signup",
  [
    check("name").isLength({ min: 6 }),
    check("email").isEmail(),
    check("authId").notEmpty(),
  ],
  usersController.createUser
);

router.post("/delete/:appID", usersController.notifyDeleteRequest);

router.patch(
  "/update-profile/:appID",
  [
    check("name").isLength({ min: 6 }),
    oneOf([
      check("biography").isEmpty(),
      check("biography").isLength({ min: 10 }),
    ]),
  ],
  usersController.updateProfile
);

module.exports = router;

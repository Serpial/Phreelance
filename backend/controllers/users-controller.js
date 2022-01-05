const { validationResult } = require("express-validator");

const User = require("../models/data/user");
const ErrorWithCode = require("../models/error-with-code");

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (err) {
    next(
      new ErrorWithCode("Could not sign up. Try again at another time.", 500)
    );
  }

  if (userExists) {
    return next(new ErrorWithCode("Email address already in use.", 409));
  }

  const newUser = new User({
    name,
    email,
    password,
    bids: [],
    auctions: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new ErrorWithCode("Sign up failed. Try again later.", 500));
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new ErrorWithCode("Log in failed!"));
  }

  if (!user || user.password !== password) {
    return next(new ErrorWithCode("Unable to log in.!", 401));
  }

  res.json({ message: "Login successful!" });
};

exports.createUser = createUser;
exports.loginUser = loginUser;

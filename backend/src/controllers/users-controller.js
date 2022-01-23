const { validationResult } = require("express-validator");

const User = require("../models/data/user");
const ErrorWithCode = require("../models/error-with-code");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return next(
      new ErrorWithCode("Could not generate user list. Please try again.")
    );
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, authId } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ authId: authId });
    userExists = userExists && User.findOne({ email });
  } catch (err) {
    next(
      new ErrorWithCode("Could not sign up. Try again at another time.", 500)
    );
  }

  if (userExists) {
    return next(
      new ErrorWithCode("User with this ID is already created.", 409)
    );
  }

  const newUser = new User({
    name,
    email,
    authId,
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new ErrorWithCode("Sign up failed. Try again later.", 500));
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.createUser = createUser;

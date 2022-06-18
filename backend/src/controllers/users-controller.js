const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { parseConnectionUrl } = require("nodemailer/lib/shared");

const User = require("../models/data/user");
const ErrorWithCode = require("../models/error-with-code");

/**
 * @apiGroup User
 * @apiDescription
 * Get user by the ID that they will be referred to throughout
 * the application.
 *
 * @returns User
 * @api {get} /users/:appID Get user by app ID
 * @apiParam appID Unique ID for the user as they are navigating the
 * application
 */
const getUserByAppId = async (req, res, next) => {
  const appId = req.params.appID;

  let user;
  try {
    user = await User.findById(appId);
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve user from source", 422));
  }

  if (!user) {
    return next(new ErrorWithCode("Could not find user with this ID.", 422));
  }
  const { authId: _authId, ...refinedUser } = user.toObject({
    getters: true,
  });
  res.json({
    user: refinedUser,
  });
};

/**
 * @apiGroup User
 * @apiDescription
 * Get the user by their authentication ID as stored in the
 * authenticator.
 *
 * @returns User
 * @api {get} /users/auth/:authID Get user by auth ID
 * @apiParam authID Unique authentication ID for the user.
 */
const getUserByAuthId = async (req, res, next) => {
  const authId = req.params.authID;

  let user;
  try {
    user = await User.findOne({
      authId,
    });
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve user from source", 422));
  }

  if (!user) {
    return next(new ErrorWithCode("Could not find user with this ID.", 422));
  }
  const { authId: _authId, ...refinedUser } = user.toObject({
    getters: true,
  });
  res.json({
    user: refinedUser,
  });
};

/**
 * @apiGroup User
 * @apiDescription
 * Create user for use in the application.
 *
 * @returns User
 * @api {post} /users/signup Create user
 * @apiBody {String} name Display name for the user.
 * @apiBody {String} email Email displayed in the application
 * @apiBody {String} authId Unique ID for the user for authorisation.
 */
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
    userExists = await User.findOne({
      authId: authId,
    });
    userExists =
      userExists &&
      User.findOne({
        email,
      });
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
  res.status(201).json({
    user: newUser.toObject({
      getters: true,
    }),
  });
};

/**
 * @apiGroup User
 * @apiDescription
 * Update the user's profile
 *
 * @returns User
 * @api {patch} /users/update-profile/:appID Update profile
 * @apiParam appID ID of the user changing their profile.
 * @apiBody {String} name Display name for the user.
 * @apiBody {String} biography Short description about the user.
 * @apiBody {String} profilePhoto Source to retrieve photo of user.
 */
const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorWithCode("Invalid inputs passed, please check your data.", 422)
    );
  }

  const appId = req.params.appID;
  const { name, biography, profilePhoto } = req.body;

  let user;
  try {
    user = await User.findById(appId);
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve user from source", 422));
  }

  if (!user) {
    return next(new ErrorWithCode("No user with this ID", 422));
  }

  user.name = name;
  if (biography) {
    user.biography = biography;
  }
  if (profilePhoto) {
    user.profilePhoto = profilePhoto;
  }

  try {
    await user.save();
  } catch (err) {
    return next(new ErrorWithCode("Error storing details", 422));
  }
  res.json({
    user: user.toObject({
      getters: true,
    }),
  });
};

/**
 * @apiGroup User
 * @apiDescription
 * This is triggered by the user when they wish to delete their account.
 * This does not directly delete the account, but instead alerts the
 * administrator to the request.
 *
 * @api {post} /users/delete/:appID Notify delete request
 * @apiParam appID ID of the user deleting their profile.
 */
const notifyDeleteRequest = async (req, res, next) => {
  const appId = req.params.appID;
  let user;
  try {
    user = await User.findById(appId);
  } catch (err) {
    return next(new ErrorWithCode("Could not retrieve user from source", 422));
  }

  if (!user) {
    return next(new ErrorWithCode("No user with this ID", 422));
  }
  console.log(
    process.env.TRANSPORTER_EMAIL,
    ": ",
    process.env.TRANSPORTER_PASSWORD
  );

  const options = {
    from: process.env.TRANSPORTER_EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: "Delete request",
    text: `User: ${user.id} wishes to delete their account`,
  };

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent:", info.response);
  });
};

exports.getUserByAppId = getUserByAppId;
exports.getUserByAuthId = getUserByAuthId;
exports.createUser = createUser;
exports.updateProfile = updateProfile;
exports.notifyDeleteRequest = notifyDeleteRequest;

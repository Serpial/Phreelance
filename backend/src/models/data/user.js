const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 6 },
  email: { type: String, unique: true, required: true },
  authId: { type: String, unique: true, required: true },
  biography: { type: String },
  profilePhoto: { type: String },
});

module.exports = mongoose.model("User", userSchema);

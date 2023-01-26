const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide your name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      'Please provide a valid email address',
    ],
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'Please provide your password'],
    minLength: 3,
    // maxLength: 12,
  },
});

// using mongoose middleware to tidy up our controllers
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// using mongoose instance methods to clean up our controllers as well.
userSchema.methods.getName = function () {
  return this.name;
};

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('user', userSchema);

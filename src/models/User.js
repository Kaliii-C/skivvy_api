const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  planned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'plans'
  }],
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'lists'
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'groups'
  }],
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
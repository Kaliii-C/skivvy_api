const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: undefined,
  }],
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'plans'
  }],
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'lists'
  }]
});

const Group = mongoose.model('groups', GroupSchema);

module.exports = Group;
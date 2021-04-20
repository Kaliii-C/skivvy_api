const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  note: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
  },
  sharedTo: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'groups'
  }
});

const Plan = mongoose.model('plans', PlanSchema);

module.exports = Plan;
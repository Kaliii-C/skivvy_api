const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'tasks'
  }],
  sharedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  }
});

const List = mongoose.model('lists', ListSchema);

module.exports = List;
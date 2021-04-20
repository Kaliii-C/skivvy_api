const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
  },
  ownerList: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'lists'
  },
});

const Task = mongoose.model('tasks', TaskSchema);

module.exports = Task;
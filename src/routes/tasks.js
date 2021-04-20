const express = require("express");
const mongoose = require("mongoose");

const List = require("../models/List");
const User = require("../models/User");
const Task = require("../models/Task");

const router = express.Router();

router.post("/add", async (req, res, next) => {
    try {
      const { title, note, status, listId } = req.body;
  
      const list = await List.findById(listId).populate("items");
  
      const newTask = await Task.create({
        _id: new mongoose.Types.ObjectId(),
        title,
        note,
        status,
        ownerList: new mongoose.Types.ObjectId(listId)
      });
  
      list.items.push(mongoose.Types.ObjectId(newTask._id));
  
      await list.save();
  
      const updatedList = await List.findById(listId).populate("items");
  
      return res.status(201).json({
        userData: updatedList,
        message: "Task added succesfully",
      });
    } catch (error) {
      console.log(error);
      res.json({
        error: "Something went wrong",
      });
    }
  });
  
  router.post("/delete", async (req, res, next) => {
    try {
      const { taskId, listId } = req.body;
  
      const list = await List.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(listId) },
        { $pull: { items: taskId } }
      );
  
      await Task.deleteOne({ _id: taskId });
  
      return res.json({
        message: "Task removed!",
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
      });
    }
  });

  router.patch("/update", async (req, res, next) => {
    Task.updateOne({_id: req.body.taskId}, req.body).exec().then(result => {
        if (!result.n) {
            return res.status(400).json({message: 'Something went wrong'});
        }
        return res.status(200).json({message: 'Updated successfully '});
    })
    .catch(err => res.status(401).send('Authentication failed'));
  });



module.exports = router;
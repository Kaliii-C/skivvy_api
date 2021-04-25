const express = require("express");
const mongoose = require("mongoose");

const List = require("../models/List");
const User = require("../models/User");

const router = express.Router();

router.post("/add", async (req, res, next) => {
    try {
      const { title, userId } = req.body;
  
      const user = await User.findById(userId).populate("lists");
  
      const userList = await List.create({
        _id: new mongoose.Types.ObjectId(),
        title,
      });
  
      user.lists.push(mongoose.Types.ObjectId(userList._id));
  
      await user.save();
  
      return res.status(201).json({
        message: "List added succesfully",
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
      const { listId, userId } = req.body;
  
      const user = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $pull: { lists: listId } }
      );
  
      await List.deleteOne({ _id: listId });
  
      return res.json({
        message: "List removed!",
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
      });
    }
  });

  router.post("/share", async (req, res, next) => {
    try {
      const { listId, groupId } = req.body;
  
      const list = await List.findById(listId);
  
      list.sharedTo.push(mongoose.Types.ObjectId(groupId));
      await list.save();
  
      const updatedList = await (await List.findById(listId)).populate('sharedTo');
  
      return res.json({
        updatedList,
        message: "Shared successfully",
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
      });
    }
  });

  router.get("/all", async (req, res, next) => {
    try{
      const lists = await List.find({}).populate('tasks').lean();
  
      return res.json({
        lists
      });
    } catch (error) {
      res.json({
        error: "Something went wrong",
      })
    }
  });

  router.post("/user-list", async (req, res, next) => {
    try{
      const {userId} = req.body;
      const lists = await User.findById(userId).populate({path: 'lists', populate: 'items'});
 
      return res.status(200).json({
      lists
      });
    } catch (error) {
      res.json({
        error: "Something went wrong",
      })
    }
  });

  module.exports = router;
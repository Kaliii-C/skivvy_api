const express = require("express");
const mongoose = require("mongoose");
const verifyToken = require("../middleware/verifyToken");

const Group = require("../models/Group");
const User = require("../models/User");
const Plan = require("../models/Plan");

const router = express.Router();

router.get("/get-group-by-id", async (req, res, next) => {
  try {
    const {id} = req.body;
    const group = await Group.findById(id)
      .populate("members", "creator", "plans", "lists");

    return res.status(200).json({
      group,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const { name, creatorId } = req.body;

    const user = await User.findById(creatorId).populate('groups');
    
    const group = await Group.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      creator: new mongoose.Types.ObjectId(creatorId),
    });
  
    
    user.groups.push(mongoose.Types.ObjectId(group._id));
    await user.save();

    return res.status(201).json({
      group,
      message: "Group added succesfully",
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
    const { groupId, listId, planId, userId } = req.body;

    const list = await List.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(listId) },
      { $pull: { sharedTo: groupId } }
    );

    const plan = await Plan.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(planId) },
      { $pull: { sharedTo: groupId } }
    );

    const user = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $pull: { groups: groupId } }
    );

    await Group.deleteOne({ _id: groupId });

    return res.json({
      message: "Group removed!",
    });
  } catch (error) {
    return res.json({
      error: "Something went wrong",
    });
  }
});

router.post("/add-member", async (req, res, next) => {
  try{
    const {groupId, memberId} = req.body;

    const user = await User.findById(memberId).populate('groups');
    const group = await Group.findById(groupId).populate('members');

    group.members.push(mongoose.Types.ObjectId(memberId));
    await group.save();

    user.groups.push(mongoose.Types.ObjectId(groupId));
    await user.save();

    const updatedGroup = await Group.findById(groupId).populate('members');

    return res.json({
      message: "New member added successfully!",
      updatedGroup
    })

  } catch (error) {
    return res.json({
      error: "Something went wrong",
    })
  }
})


module.exports = router;

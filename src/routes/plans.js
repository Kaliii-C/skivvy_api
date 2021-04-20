const express = require("express");
const mongoose = require("mongoose");
const Group = require("../models/Group");

const Plan = require("../models/Plan");
const User = require("../models/User");

const router = express.Router();

router.post("/add", async (req, res, next) => {
  try {
    const { title, note, dueDate, userId } = req.body;

    const user = await User.findById(userId).populate("planned");

    const userPlan = await Plan.create({
      _id: new mongoose.Types.ObjectId(),
      title,
      note,
      dueDate,
      owner: new mongoose.Types.ObjectId(userId),
    });

    user.planned.push(mongoose.Types.ObjectId(userPlan._id));

    await user.save();

    const updatedUser = await User.findById(userId).populate("planned");

    return res.status(201).json({
      userData: updatedUser,
      message: "Plan added succesfully",
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
    const { eventId, userId } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $pull: { planned: eventId } }
    );

    await Plan.deleteOne({ _id: eventId });

    return res.json({
      message: "Event removed!",
    });
  } catch (error) {
    return res.json({
      error: "Something went wrong",
    });
  }
});

router.post("/share", async (req, res, next) => {
  try {
    const { eventId, groupId } = req.body;

    const plan = await Plan.findById(eventId);

    plan.sharedTo.push(mongoose.Types.ObjectId(groupId));
    await plan.save();

    const updatedPlan = await (await Plan.findById(eventId)).populated('sharedTo');

    return res.json({
      updatedPlan,
      message: "Shared successfully",
    });
  } catch (error) {
    return res.json({
      error: "Something went wrong",
    });
  }
});

module.exports = router;

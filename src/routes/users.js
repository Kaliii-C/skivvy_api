const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = require("../middleware/verifyToken");

const User = require("../models/User");
const Plan = require("../models/Plan");

const router = express.Router();

router.get("/:id?", verifyToken, async (req, res, next) => {
  try {
    const id = req.data.userId || req.param.id;
    const user = await User.findById(id).populate('planned', 'lists', 'groups');

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
});

router.get("/all",verifyToken, async (req, res, next) => {
  try{
    const users = await User.find({_id: { $ne: req.data.userId},}).populate('lists','planned','groups');

    return res.json({
      users
    });
  } catch (error) {
    res.json({
      error: "Something went wrong",
    })
  }
});


router.post("/find-by-name", async (req, res) => {
  try {
    const { name } = req.body;

    const userResults = await User.find({
      $or: [{ firstName: name }, { lastName: name }, { email: name }],
    })
      .select("firstName lastName email")
      .lean();

    console.log(userResults);

    return res.status(200).json(userResults);
  } catch (error) {
    res.status(500).json({
      message: "Authentication failed",
    });
  }
});

module.exports = router;

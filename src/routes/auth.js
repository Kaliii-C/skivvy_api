const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hasher = require("../middleware/passwordHasher");
const verifyToken = require("../middleware/verifyToken");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
  
      const user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({
          message: "User already exist"
        });
      }
  
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        password: await hasher(password),
        isVerified: true
      });
  
      await newUser.save();
  
      return res.json({
        message: "Registartion successful"
      });
    } catch (error) {
      console.log(error);
      return res.json({
        error
      });
    }
  });

  router.post("/login", async (req, res, next) => {
    User.findOne({ email: req.body.email })
      .select("+password")
      .exec()
      .then(user => {
        if (!user) {
          return res.json({ message: "User does not exist" });
        }
  
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) {
              return res.status(401).json({
                message: "Invalid password"
              });
            }
  
            if (isMatch) {
              jwt.sign(
                { email: user.email, userId: user._id },
                "secretkey",
                (e, token) => {
                  res.json({
                    id: user._id,
                    token,
                    message: "Authentication successful"
                  });
                }
              );
            } else {
              return res.status(401).json({
                message: "Authentication failed"
              });
            }
          });
        } else {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
      })
      .catch(err => {
        console.log(err);
        return res.sendStatus(401).json({
          message: "Authentication failed"
        });
      });
  });
  
  module.exports = router;
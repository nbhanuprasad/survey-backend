const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Authentication = db.authentication
exports.checkDuplicateEmail = (req, res, next) => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Failed! Email Required!"
    });
  }
  // Email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  });

};


exports.checkDuplicateDevice = (req, res, next) => {
  if (!req.body.deviceId) {
    res.status(400).send({
      message: "Failed! device Required!"
    });
  }
  // Email
  Authentication.findOne({
    where: {
      deviceId: req.body.deviceId
    }
  }).then(device => {
    if (device) {
     return res.status(200).send({
      message:"user already loggedin",
        deviceId:device.deviceId,
        token: device.jwtToken
      });
      return;
    }

    next();
  });

};






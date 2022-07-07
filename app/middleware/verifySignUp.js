const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

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






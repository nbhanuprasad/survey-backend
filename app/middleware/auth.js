const jwt = require("jsonwebtoken");
const config = require("../config/secret.config.js");
const db = require("../models");
const User = db.user;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  await jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isSuperAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user == null) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    if (user.userType === "super-admin") {
      next();
      return;
    }


    res.status(403).send({
      message: "Require Super-Admin Role!"
    });
    return;

  });
};


const authJwt = {
  verifyToken: verifyToken,
  isSuperAdmin: isSuperAdmin,

};
module.exports = authJwt;

const jwt = require("jsonwebtoken");
const config = require("../config/secret.config.js");
const db = require("../models");
const User = db.user;
const Authentication = db.authentication
verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  await jwt.verify(token, config.secret, async(err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    let checkTokenExists = await Authentication.findOne({
      where:{deviceId:decoded.deviceId}
    })
    if(!checkTokenExists){
      return res.status(401).send({
        message:"token invalid..!"
      })
    }
    req.userId = decoded.id
    req.deviceId =  decoded.deviceId
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

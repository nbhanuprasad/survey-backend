const db = require("../models");

const User = db.user
exports.getAllAdmins = (req, res) => {
  //find all admins
  User.findAll({
    where: {
      userType: "admin"
    }
  }).then(user => {

    return res.status(200).send(user);
  })

};

const db = require("../models");
const config = require("../config/secret.config");
const User = db.user;
const Authentication = db.authentication
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { authentication } = require("../models");

exports.signup = (req, res) => {

  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    userType: req.body.userType ? req.body.userType : "admin"
  })
    .then(user => {
      let user_details = {
        id:user.dataValues.id,
        username:user.dataValues.username,
        email:user.dataValues.email,
        userType:user.dataValues.userType
      }
      res.send({ message: "User registered successfully!", user: user_details });
    })
    .catch(err => {
      console.log("error")
      res.status(500).send({ message: err.message });
    });
};


exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "No User found." });
      }
      //check user active status
      if(!user.active){
        return res.status(404).send({ message: "This Account has been deactivaed. Contact Superadmin for further Info" });

      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id,deviceId:req.body.deviceId }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      
      Authentication.create({
        jwtToken:token,
        deviceId:req.body.deviceId,
        userId:user.id
      })
        .then(authentication => {
          console.timeLog("authentication",authentication)
        })
        .catch(err => {
          console.log("error")
        return  res.status(500).send({ message: err.message });
        });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        accessToken: token
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout =async (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      //remove decodeid row
    await  Authentication.destroy({
        where:{deviceId:req.deviceId,userId:req.userId}
      })
      res.status(200).send({
        message: "logout successfull"
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//change password
exports.changePassword = (req, res) => {
  if(!req.body.oldPassword || !req.body.newPassword){
    return res.status(400).json({
      message:"old password and new password required"
    })
  }
  //finduser
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "No User found." });
      }
      //check whether user entered correct old password
      var checkOldPassword =await bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );

      if (!checkOldPassword) {
        return res.status(401).send({
          message: "Old Password did not match!"
        });
      }

      //if password matched update it
    //update password
    user.password =await bcrypt.hashSync(req.body.newPassword, 8)
    user.save();
      res.status(200).send({
       message:"password update successfully"
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

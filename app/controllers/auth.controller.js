const db = require("../models");
const config = require("../config/secret.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
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

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      user.jwtToken = token
      user.save()
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

exports.logout = (req, res) => {
  User.findOne({
    where: {
      id: req.params.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.jwtToken = null
      user.save()
      res.status(200).send({
        message: "logout successfull"
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const db = require("../models");

const User = db.user
const Authentication = db.authentication
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

exports.deactivateAdmin = (req, res) => {
  if(!req.query.active){
    return res.status(400).send("active key required")
  }
  var updatee;
  var status;
  if(req.query.active== "true"){
    updatee = true
    status = 'admin activated successfully'
  }else{
    updatee = false
    status ='admin deactivated'
  }
  //find all admins
  User.update(
    {active:updatee},
   { where: {
      id: req.params.adminId
    }}
  ).then(async resp => {
    if(resp==1){
      //logout all his devices
      await  Authentication.destroy({
        where:{userId:req.params.adminId}
      })
      return res.status(200).send(status);
    }else{
      return res.status(404).send("error occured")
    }
  }).catch((Err)=>{
    return res.status(500).send(Err)
  })

};


exports.viewAdmin = (req, res) => {
  console.log("admin",req.params.adminId)
  //find all admins
  User.findOne({
    where: {
      id: req.params.adminId
    },
    include:[{
      model:db.survey,as:'survey'
    }]
  }).then(user => {
    return res.status(200).send(user);
  })

};

const db = require("../models");
const config = require("../config/secret.config");
const Response = db.response
const surveyServices = require("../middleware/survey")
const Survey = db.survey
exports.surveyResponse = async (req, res) => {
  try {
    //check survey publish status
    let surveyStatus = await Survey.findOne({
      where: { id: req.body.surveyId }
    })
    if (!surveyStatus.dataValues.isPublished) {
      return res.status(400).json({
        message: "Survey No longer Exists..!"
      })
    }
    //check email
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({
        message: "email and name are mandatory to record response"
      })
    }
    console.log("req", req.body.email)
    //check duplicate response
    let checkenduser = await surveyServices.duplicateResponse(req.body.email, req.body.surveyId)
    //if response already exists with mail id
    console.log("checkend", checkenduser)
    if (checkenduser) {
      return res.status(400).send({
        message: "Response Already Recorded!"
      });
    }
    //save email,usernamein response table
    let EndUser = await surveyServices.createEndUser(req.body.email, req.body.name, req.body.surveyId)
    for (let i = 0; i < req.body.responses.length; i++) {
      await Response.create({
        response: req.body.responses[i].response,
        enduserId: EndUser.dataValues.id,
        questionId: req.body.responses[i].id,
        surveyId:req.body.surveyId
      })
    }

    return res.status(200).send({
      message: "response recorded"
    })
  } catch (err) {
    res.status(500).send(err)
  }
};

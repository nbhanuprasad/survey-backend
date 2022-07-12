const db = require("../models");
const User = db.user
const Survey = db.survey
const surveyServices = require("../middleware/survey");
const { survey } = require("../models");

exports.createSurvey = async (req, res) => {
  try {
    //check title and description coming in body or not
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        message: "title and description required to create survey"
      })
    }
    //save title,description,is published in survey table
    let surveyDetails = await surveyServices.createSurvey(req.body.title, req.body.description, false, req.userId)
    for (let i = 0; i < req.body.questions.length; i++) {
      switch (req.body.questions[i].question_type) {
        case "multiple-choice":
          await surveyServices.createQuestion(req.body.questions[i], surveyDetails.dataValues.id)
          break;
        case "text-box":
          await surveyServices.createQuestion(req.body.questions[i], surveyDetails.dataValues.id)
          break;
        case "rating":
          await surveyServices.createQuestion(req.body.questions[i], surveyDetails.dataValues.id)
      }
    }
    let survey = await Survey.findOne({
      where: { id: surveyDetails.dataValues.id },
      include: [
        {
          model: db.question, as: 'question',
          include: [{
            model: db.choice, as: "choice"
          }]
        }
      ]
    })
    res.status(200).send(survey)
  } catch (err) {
    res.status(500).send(err)
  }

};

exports.surveyList = async(req,res) =>{
  Survey.findAll({
    where:{userId:req.userId}
  }).then(surveys => {

    return res.status(200).send(surveys);
  }).catch((err)=>{
    return res.status(500).send(err)
  })
}

//delete survey

exports.deleteSurvey = async(req,res) =>{
  Survey.destroy({
    where:{id:req.params.surveyId}
  }).then(surveys => {
    return res.status(200).send("survey deleted successfully");
  }).catch((err)=>{
    return res.status(500).send(err)
  })
}
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

exports.updateSurvey = async (req,res)=>{
if(!req.body.title || !req.body.description){
  return res.status(400).send({
    message:"title and description are required"
  })
}
//update survey
Survey.update(
  {title:req.body.title,description:req.body.description},
  {where:{id:req.params.surveyId}}
).then((resp)=>{
  console.log("resp",resp)
  if(resp == 1){
  return res.status(200).json({
    message:"title and description updated successfully"
  })
}else{
  return res.status(200).json({
    message:"Error Occured while updating survey details"
  })
}
}).catch((err)=>{
  return res.status(500).json({
    message:"error updating surey detail"
  })
})
}
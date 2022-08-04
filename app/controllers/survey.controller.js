const db = require("../models");
const User = db.user
const Survey = db.survey
const surveyServices = require("../middleware/survey");
const { survey, user } = require("../models");
let email = require("../utils/sendEmail")
let Response = db.response
let Question = db.question

exports.createSurvey = async (req, res) => {
  try {
    //check title and description coming in body or not
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        message: "title and description required to create survey"
      })
    }
    //save title,description,is published in survey table
    let surveyDetails = await surveyServices.createSurvey(req.body.title, req.body.description, req.body.isPublished, req.userId)
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
    if(surveys == 0){
          return res.status(404).send({
              message:"cannot delete survey.survey id not found"
            })
    }
    return res.status(200).send("survey deleted successfully");
  }).catch((err)=>{
    return res.status(500).send(err)
  })
}

exports.updateSurvey = async (req,res)=>{
 //publish and unpublish survey
 if (req.query.isPublished == "true") {
  let published = await Survey.update(
    { isPublished: true },
    { where: { id: req.params.surveyId } }
  )
  console.log("published")
  return res.status(200).send({
    message: "survey published"
  })
} else if (req.query.isPublished == "false") {
  let unpublished = await Survey.update(
    { isPublished: false },
    { where: { id: req.params.surveyId } }
  )
  console.log("unpublished")
  return res.status(200).send({
    message: "survey unpublished"
  })
} else {
  await Survey.findOne({
    where: { id: req.params.surveyId },
    include: [
      {
        model: db.question,
        as: "question",
        include: [
          {
            model: db.choice,
            as: "choice",
          },
        ],
      },
    ],
  }).then(async (survey) => {
    console.log("survey", survey.dataValues);
    survey.title = req.body.title;
    survey.description = req.body.description;
    survey.isPublished = req.body.isPublished;
    let newQuestionsArray = [];
    if (survey.dataValues.question.length == 0) {
      for (let i = 0; i < req.body.questions.length; i++) {
        if (newQuestionsArray.length == 0) {
          newQuestionsArray.push(req.body.questions[i]);
        } else {
          for (let k = 0; k < newQuestionsArray.length; k++) {
            if (newQuestionsArray[k].title !== req.body.questions[i].title) {
              newQuestionsArray.push(req.body.questions[i]);
            }
          }
        }
      }
    } else {
      for (let i = 0; i < survey.dataValues.question.length; i++) {
        var questionFound = false;
        for (j = 0; j < req.body.questions.length; j++) {
          console.log("new questions", req.body.questions[j].id)
          if (req.body.questions[j].id == undefined) {
            questionFound = true
            console.log("new question camea")
            if (newQuestionsArray.length == 0) {
              newQuestionsArray.push(req.body.questions[j]);
            } else {
              let newquestionExists = false
              for (let k = 0; k < newQuestionsArray.length; k++) {
                if (newQuestionsArray[k].title == req.body.questions[j].title) {
                  newquestionExists = true
                }

              }
              if (!newquestionExists) {
                newQuestionsArray.push(req.body.questions[i]);
              }
            }
          } else {
            if (survey.dataValues.question[i].id == req.body.questions[j].id) {
              console.log("found");
              questionFound = true;
              let questionUpdate = await surveyServices.updateQuestion(
                req.body.questions[j],
                survey.dataValues.question[i]
              );
            }
          }
        }
        if (!questionFound) {
          //delete question
          await Question.destroy({
            where: { id: survey.dataValues.question[i].id },
          });
        }
      }
    }
    console.log("newQuestins", newQuestionsArray);

    for (let n = 0; n < newQuestionsArray.length; n++) {
      await surveyServices.createQuestion(newQuestionsArray[n], survey.dataValues.id);
    }
    survey.save();
    return res.status(200).send({
      message: "survey updated successfully",
    });
  });
  }
}

  //send email
  exports.sendEmail = async (req, res) => {
    if (!req.body.surveyLink || !req.body.endsuserEmail) {
      return res.status(400).send({
        message: "email and survey link mandatory"
      })
    }
    let response = await email.sendSurveyLinkEmail(req.body.endsuserEmail, req.body.surveyLink)
    console.log("res", response)
    if (response) {
      return res.status(200).send("email sent succesfully")
    } else {
      return res.status(200).send("email not sent")
    }
  }


  exports.viewSurvey = (req,res)=>{
      
    Survey.findOne({
       where: { id: req.params.surveyId },
       include: [
        {
          model: db.question, as: 'question',
          include: [
            {
              model: db.choice, as: "choice",
            },
            {
              model: db.response, as: "response",
              include: [{
                model: db.endUser, as: "enduser"
              }]
            }
          ]
        }
      ]
     }) .then((surveyDetails) => {
      for (let i = 0; i < surveyDetails.dataValues.question.length; i++) {
        if (surveyDetails.dataValues.question[i].questionType == "multiple-choice") {
          for (
            let j = 0;
            j < surveyDetails.dataValues.question[i].choice.length;
            j++
          ) {
            for (
              let k = 0;
              k < surveyDetails.dataValues.question[i].response.length;
              k++
            ) {
              if (
                surveyDetails.dataValues.question[i].choice[j].choice ==
                surveyDetails.dataValues.question[i].response[k].response
              ) {
                if (
                  surveyDetails.dataValues.question[i].choice[j].dataValues
                    .count
                ) {
                  surveyDetails.dataValues.question[i].choice[j].dataValues
                    .count++;
                } else {
                 
  
                  surveyDetails.dataValues.question[i].choice[
                    j
                  ].dataValues.count = 1;
                }
              }
            }
          }
        }else if(surveyDetails.dataValues.question[i].questionType == "rating"){
          let userRatings = [{key:1,count:0},{key:2,count:0},{key:3,count:0},{key:4,count:0},{key:5,count:0}]
          for(let j=0;j<surveyDetails.dataValues.question[i].response.length;j++){
            console.log(typeof(surveyDetails.dataValues.question[i].response[j].dataValues.response))
            if(surveyDetails.dataValues.question[i].response[j].dataValues.response == "1"){
              userRatings[0].count++
            }else if(surveyDetails.dataValues.question[i].response[j].dataValues.response == "2"){
              userRatings[1].count++
            }else if(surveyDetails.dataValues.question[i].response[j].dataValues.response =="3"){
              userRatings[2].count++
            }else if(surveyDetails.dataValues.question[i].response[j].dataValues.response == "4"){
              console.log(userRatings[3])
userRatings[3].count++
            }else {
userRatings[4].count++
            }
          }
         console.log(";;",userRatings)
         surveyDetails.dataValues.question[i].dataValues.userRatings = userRatings

        }
      }
       res.status(200).send(surveyDetails);
     })
     .catch((err) => {
       console.log("error");
       res.status(500).send({ message: err.message });
     });
   }

   exports.openSurvey = (req,res)=>{
      
    Survey.findOne({
       where: { id: req.query.surveyId },
       include: [
        {
          model: db.question, as: 'question',
          include: [
            {
              model: db.choice, as: "choice",
            },
          ]
        }
      ]
     }) .then((surveyDetails) => {
      if (!surveyDetails.dataValues.isPublished || !surveyDetails) {
        return res.status(404).send({
          message: "survey dont exist"
        })
      }
       res.status(200).send(surveyDetails);
     })
     .catch((err) => {
       console.log("error");
       res.status(500).send({ message: err.message });
     });
   }

   exports.generateSurveyReport = async (req, res) => {
    let survey_reports = []
    let survey_responses = await Response.findAll({
      where: { surveyId: req.query.surveyId },
      include: ["question", "enduser"],
    })
    for (let i = 0; i < survey_responses.length; i++) {
      if (survey_reports.length == 0) {
        let object ={
          'user email':survey_responses[i].enduser.email,
          'user name':survey_responses[i].enduser.name
        }
        survey_reports.push( object )
      } else {
        email_found = false
        for (let j = 0; j < survey_reports.length; j++) {
          if (survey_responses[i].enduser.email == survey_reports[j]['user email']) {
            email_found = true
          }
        }
        if (!email_found) {
          let object ={
            'user email':survey_responses[i].enduser.email,
            'user name':survey_responses[i].enduser.name
          }
          survey_reports.push(object)
        }
      }
    }
    for (let i = 0; i < survey_responses.length; i++) {
    
      for (let j = 0; j < survey_reports.length; j++) {
        if (survey_responses[i].enduser.email == survey_reports[j]["user email"]) {
          let question = survey_responses[i].question.title
          survey_reports[j][question] = survey_responses[i].response
        }
      }
    }
    return res.status(200).send(survey_reports);
  };
const db = require("../models");
const Survey = db.survey;
const Question = db.question
const endUser = db.endUser
const Choice = db.choice

exports.createSurvey = async (title,description,isPublished,userId) => {
  try {
    //create survey
    let surveyDetails = await Survey.create({
      title: title,
      description: description,
      isPublished:isPublished,
      userId: userId,
    })
    return surveyDetails
  } catch (err) {
    return err
  }
};

exports.createQuestion = async (question,surveyId) => {
    try {
      //create survey
      let questionInfo = await Question.create({
        title: question.title,
        required: question.required,
        questionType:question.question_type,
        surveyId: surveyId,
      })
      console.log("question info",questionInfo)
if(question.question_type === "multiple-choice"){
    for(let i=0;i<question.options.length;i++){
    await Choice.create({
        choice:question.options[i].option,
        questionId:questionInfo.dataValues.id
    })
    }
}

      return questionInfo
    } catch (err) {
      return err
    }
  };


  //check endUserDetails
exports.duplicateResponse = async (email, surveyId) => {

  // Email
  let userFound = await endUser.findOne({
    where: {
      email: email, surveyId: surveyId
    }
  })
  console.log(userFound)
  if (userFound !== null) {
    return true
  }
  return false


};

exports.createEndUser = async (email, name, surveyId) => {
  try {
    console.log("endus", email, name, surveyId)
    let endUserr = await endUser.create({
      name: name,
      email: email,
      surveyId: surveyId
    })
    return endUserr
  } catch (err) {
    return err
  }
};







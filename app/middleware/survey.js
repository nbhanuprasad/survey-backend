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


exports.updateQuestion = async (question_info, existing_question) => {
  let update_question = await Question.update(
    { title: question_info.title, required: question_info.required },
    { where: { id: question_info.id } }
  );

  if (question_info.question_type == "multiple-choice") {
    let new_choices = [];
    if (existing_question.dataValues.choice.length == 0) {
      for (let i = 0; i < question_info.choices.length; i++) {
        await Choice.create({
          choice: question_info.choices[i].choice,
          questionId: existing_question.dataValues.id,
        });
      }
    } else {
      for (let i = 0; i < existing_question.dataValues.choice.length; i++) {
        let option_found = false;
        for (let j = 0; j < question_info.options.length; j++) {
          if (question_info.options[j].id == undefined) {
            option_found = true
            if (new_choices.length == 0) {
              new_choices.push(question_info.options[j]);
            } else {
              let choice_founnnd = false
              for (let k = 0; k < new_choices.length; k++) {
                if (new_choices[k].choice == question_info.options[j].choice) {
                  choice_founnnd = true
                }
              }
              if (!choice_founnnd) {
                new_choices.push(question_info.options[j]);

              }
            }
          } else {
            if (
              existing_question.dataValues.choice[i].id ==
              question_info.options[j].id
            ) {
              option_found = true;
              await Choice.update(
                { choice: question_info.options[j].choice },
                { where: { id: question_info.options[j].id } }
              );
            }
          }
        }

        if (!option_found) {
          await Choice.destroy({
            where: { id: existing_question.dataValues.choice[i].id },
          });
        }
      }
      console.log("new choices", new_choices);
      for (let i = 0; i < new_choices.length; i++) {
        await Choice.create({
          choice: new_choices[i].choice,
          questionId: existing_question.dataValues.id,
        });
      }
    }
  }
  console.log("question", update_question);

  return true;
};






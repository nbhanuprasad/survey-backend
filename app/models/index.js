const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.survey = require("../models/survey.model")(sequelize, Sequelize)
db.question = require("../models/question.model")(sequelize, Sequelize)
db.choice = require("../models/choice.model")(sequelize, Sequelize)
db.authentication = require("./authentication.model")(sequelize,Sequelize)
db.endUser = require("./end-user.model")(sequelize,Sequelize)
db.response = require("./responses.model")(sequelize,Sequelize)
//relation between user and survey
db.user.hasMany(db.survey, {
  as: 'survey'
});
db.survey.belongsTo(db.user, {
  foreignKey: 'userId', as: 'user',
});

db.user.hasMany(db.authentication,{
  as:'authentication'
})

db.authentication.belongsTo(db.user,{
  foreignKey: 'userId', as: 'user',
})
//relation between survey and questions
db.survey.hasMany(db.question, {
  as: 'question'
});
db.question.belongsTo(db.survey, {
  foreignKey: 'surveyId', as: 'survey',
});

//relation between questions and choices
db.question.hasMany(db.choice, {
  as: 'choice'
});
db.choice.belongsTo(db.question, {
  foreignKey: 'questionId', as: 'question',
});

//relation between survey and enduser
db.survey.hasMany(db.endUser, {
  as: 'enduser'
});
db.endUser.belongsTo(db.survey, {
  foreignKey: 'surveyId', as: 'survey',
});

//relation between response and enduser
db.endUser.hasMany(db.response, {
  as: 'response'
});
db.response.belongsTo(db.endUser, {
  foreignKey: 'enduserId', as: 'enduser',
});

//relatin between question and response
db.question.hasMany(db.response, {
  as: 'response'
});
db.response.belongsTo(db.question, {
  foreignKey: 'questionId', as: 'question',
});

//response and surveys
db.survey.hasMany(db.response, {
  as: 'response'
});
db.response.belongsTo(db.survey, {
  foreignKey: 'surveyId', as: 'survey',
});
module.exports = db;

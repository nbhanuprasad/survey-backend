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

//relation between user and survey
db.user.hasMany(db.survey, {
  as: 'survey'
});
db.survey.belongsTo(db.user, {
  foreignKey: 'userId', as: 'user',
});

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

module.exports = db;

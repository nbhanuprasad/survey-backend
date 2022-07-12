module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define("surveys", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    isPublished: {
      type: Sequelize.BOOLEAN
    },
    surveyLink: {
      type: Sequelize.STRING
    }

  });

  return Survey;
};

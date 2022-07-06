module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("questions", {
      title: {
        type: Sequelize.STRING
      },
      required: {
        type: Sequelize.BOOLEAN
      },
      questionType: {
        type: Sequelize.ENUM("text-box", "multiple-choice", "rating"),
        default: 'text-box'
      }
    });
    return Question;
  };
  
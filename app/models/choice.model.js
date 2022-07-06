module.exports = (sequelize, Sequelize) => {
    const Choice = sequelize.define("choices", {
      choice: {
        type: Sequelize.STRING
      }
    });
    return Choice;
  };
  
module.exports = (sequelize, Sequelize) => {
    const endUser = sequelize.define("endusers", {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      }
    });
    return endUser;
  };
  
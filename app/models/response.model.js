module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("responses", {
      answer: {
        type: Sequelize.STRING
      }
    });
    return Response;
  };
  
module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("responses", {
      response: {
        type: Sequelize.STRING
      }
    });
    return Response;
  };
  
module.exports = (sequelize, Sequelize) => {
    const Authentication = sequelize.define("authentications", {
      jwtToken: {
        type: Sequelize.STRING
      },
    deviceId:{
        type:Sequelize.STRING
    }
    });
    return Authentication;
  };
  
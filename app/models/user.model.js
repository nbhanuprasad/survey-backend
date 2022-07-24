module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    userType: {
      type: Sequelize.ENUM("super-admin", "admin"),
      default: "admin",
    },
    active:{
      type:Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:true
    }
  });

  return User;
};

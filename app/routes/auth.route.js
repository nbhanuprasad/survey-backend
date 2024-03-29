const { verifySignUp,authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    verifySignUp.checkDuplicateEmail,
    controller.signup
  );

  app.post("/api/auth/signin",verifySignUp.checkDuplicateDevice, controller.signin);
  app.put("/api/auth/logout",authJwt.verifyToken, controller.logout);
  app.put("/api/auth/changepassword",authJwt.verifyToken, controller.changePassword);

};



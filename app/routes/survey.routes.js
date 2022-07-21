const { authJwt } = require("../middleware");
const controller = require("../controllers/survey.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post(
    "/api/createsurvey",
    [authJwt.verifyToken],
    controller.createSurvey
  );
  app.get(
    "/api/survey/list",
    [authJwt.verifyToken],
    controller.surveyList
  );

  app.delete(
    "/api/survey/:surveyId",
    [authJwt.verifyToken],
    controller.deleteSurvey
  );

  app.put(
    "/api/survey/:surveyId",
    [authJwt.verifyToken],
    controller.updateSurvey
  )

};

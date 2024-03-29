const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/superadmin/alladmins", [authJwt.verifyToken, authJwt.isSuperAdmin], controller.getAllAdmins);
  app.put("/api/superadmin/:adminId", [authJwt.verifyToken, authJwt.isSuperAdmin], controller.deactivateAdmin);
  app.get(
    "/api/superadmin/:adminId",
    [authJwt.verifyToken],
    controller.viewAdmin
  );
 


};

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
// const manager = require("../manage-user/manager");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/xivo",
    [authJwt.verifyToken, authJwt.isXivo],
    controller.XivoBoard
  );

  app.get(
    "/api/test/cebox",
    [authJwt.verifyToken, authJwt.isCebox],
    controller.CeboxBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

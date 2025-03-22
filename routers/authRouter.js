const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const passport = require("passport");

authRouter.post("/sign-up", authController.signUpPost);

authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.loginPost
);

authRouter.post("/token", authController.refreshToken);

module.exports = authRouter;

require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { verifyLocal, verifyJwt } = require("../lib/passportHelpers");

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const local = new LocalStrategy(verifyLocal);
const jwt = new JwtStrategy(jwtOpts, verifyJwt);

passport.use(local);
passport.use(jwt);

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const verifyLocal = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const verifyJwt = async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

module.exports = { verifyJwt, verifyLocal };

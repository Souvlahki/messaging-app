const { validateUser } = require("../lib/formValidation");
const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUpPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorsList = errors.array();

    if (!errors.isEmpty()) {
      return res.json({
        errors: errorsList,
      });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: req.body.username,
        },
      });

      if (existingUser) {
        errorsList.push({
          type: "field",
          value: `${req.body.username}`,
          msg: "username already exists",
          path: "username",
        });

        return res.json({
          errors: errorsList,
        });
      }

      const hashedPwd = await bcrypt.hash(req.body.password, 10);
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPwd,
        },
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.loginPost = (req, res, next) => {
  const { id, username } = req.user;
  const payload = { id, username };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ accessToken });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.json({ message: "Unauthorized" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.json({ message: "invalid refresh token" });

    const payload = { id: user.id, username: user.username };
    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    res.json({ accessToken: newAccessToken });
  });
};

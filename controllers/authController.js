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

  jwt.sign(
    payload,
    process.env.JWT_secret,
    { expiresIn: "7d" },
    (err, token) => {
      if (err) {
        res.json({
          message: "Error generating token",
        });
      }

      res.status(201).json({
        token,
      });
    }
  );
};

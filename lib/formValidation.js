const { body } = require("express-validator");

const alphaErr = "must only contian letters.";
const usernameLengthErr = "must be between 8-20 characters";
const passwordLengthErr = "must be between 10-30 characters";

const validateUser = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage(`username ${alphaErr}`)
    .isLength({ min: 8, max: 20 })
    .withMessage(`username ${usernameLengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 10, max: 30 })
    .withMessage(`password ${passwordLengthErr}`),
];

module.exports = { validateUser };

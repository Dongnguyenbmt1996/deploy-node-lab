const express = require("express");
const { body } = require("express-validator");
const authControlers = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .trim()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authControlers.signup
);

router.post("/login", authControlers.login);

router.get("/status", isAuth, authControlers.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authControlers.updateUserStatus
);
module.exports = router;

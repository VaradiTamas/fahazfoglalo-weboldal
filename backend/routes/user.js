const express = require("express");
const router = express.Router();

const signUpMW = require('../middleware/user/sign-up-middleware');
const signInMW = require('../middleware/user/sign-in-middleware');


router.post("/signup",
  signUpMW
);

router.post("/login",
  signInMW
);

module.exports = router;

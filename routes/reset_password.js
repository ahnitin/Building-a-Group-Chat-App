const express = require("express");

const router = express.Router();
const passwordController = require("../controller/reset_password");

router.post("/forgotpassword", passwordController.ForgetPassword);

router.use(
  "/updatepassword/:resetpasswordid",
  passwordController.updatePassword
);

router.get("/resetpassword/:id", passwordController.resetPassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);
router.get("/users", userController.getUsers);
module.exports = router;

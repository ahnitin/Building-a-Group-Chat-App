const express = require("express")
const router= express.Router();
const userAuthentication = require("../middleware/auth");
const chatController = require("../controller/chats");

router.post("/chats",userAuthentication.authenticate,chatController.postAddChat)
router.get("/chats",userAuthentication.authenticate,chatController.getChats)
module.exports = router
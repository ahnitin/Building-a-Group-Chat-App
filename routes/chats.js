const express = require("express")
const router= express.Router();
const userAuthentication = require("../middleware/auth");
const chatController = require("../controller/chats");

router.post("/chats",userAuthentication.authenticate,chatController.postAddChat)
router.get("/chats",userAuthentication.authenticate,chatController.getChats)
router.post("/groups",userAuthentication.authenticate,chatController.postAddGroup)
router.get("/groups",userAuthentication.authenticate,chatController.getGroups);
router.get("/Allusers",chatController.getAllUsers)
router.post("/admin",chatController.CreateUserAdmin)
router.post("/removeadmin",chatController.romoveAdmin)
router.post("/removeuser",chatController.romoveGroupUser)
router.post("/addusers",chatController.postAddUsersToGroup)

module.exports = router
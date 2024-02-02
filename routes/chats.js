const express = require("express");
const router = express.Router();
const userAuthentication = require("../middlewares/auth");
const chatController = require("../controllers/chats");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/chats",
  userAuthentication.authenticate,
  chatController.postAddChat
);
router.get("/chats", userAuthentication.authenticate, chatController.getChats);

router.post(
  "/groups",
  userAuthentication.authenticate,
  chatController.postAddGroup
);
router.get(
  "/groups",
  userAuthentication.authenticate,
  chatController.getGroups
);
// Route for uploading files
router.post(
  "/uploadfiles",
  upload.single("image"),
  userAuthentication.authenticate,
  chatController.postAddFiles
);

router.get("/all-users", chatController.getAllUsers);
router.post("/admin", chatController.CreateUserAdmin);
router.post("/remove-admin", chatController.romoveAdmin);
router.post("/remove-user", chatController.romoveGroupUser);
router.post("/add-users", chatController.postAddUsersToGroup);

module.exports = router;

const socketService = (socket) => {
  socket.on("new-group-message", (groupId, chat, name) => {
    console.log(groupId);
    console.log(chat, name);
    socket.broadcast.emit("group-message", groupId, chat, name);
  });
};

module.exports = socketService;

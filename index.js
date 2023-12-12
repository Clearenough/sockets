const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3001/" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(socket.id, "New connection");

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    if (!message) return;
    console.log(message, "sendMessage");
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    console.log(message);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("deleteMessage", (message) => {
    console.log(onlineUsers, "in message", message);
    if (!message) return;
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    console.log(message, "message to delete", user);

    if (user) {
      console.log(message, "emmit");
      io.to(user.socketId).emit("getDeletedMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("diskonnect", onlineUsers);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("after disconnect", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3001);

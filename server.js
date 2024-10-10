const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", function (socket) {
  socket.on("newuser", function (user) {
    socket.broadcast.emit("update", `${user} joined the chat room`);
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(5000);

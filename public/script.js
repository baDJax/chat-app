(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;
  app
    .querySelector(".join-screen #join-btn")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.add("inactive");
      app.querySelector(".chat-screen").classList.remove("inactive");
    });

  const sendMessage = () => {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }
    renderMessage("my", {
      username: uname,
      message: message,
    });
    socket.emit("chat", {
      username: uname,
      message: message,
    });
    app.querySelector(".chat-screen #message-input").value = "";
  };

  app
    .querySelector(".chat-screen #message-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

  app
    .querySelector(".chat-screen #send-btn")
    .addEventListener("click", sendMessage);

  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  socket.on("chat", function (message) {
    renderMessage("chat", message);
  });

  app
    .querySelector(".chat-screen #exit-btn")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });
  const renderMessage = (type, message) => {
    const messageContainer = document.querySelector(".chat-screen .messages");
    console.log("type", type);
    let messageData = `
          ${
            type != "update"
              ? `<div class=" ${
                  type === "my"
                    ? "message my-message"
                    : type === "chat"
                    ? "message other-message"
                    : ""
                }">
                    <div class="">
                      <div class="name">${
                        type === "my"
                          ? "You"
                          : type === "chat"
                          ? message.username
                          : ""
                      }</div>
                      <div class="text">${message.message}</div>
                    </div>   
                </div>`
              : `<div class="update">${message}</div>`
          }`;
    messageContainer.innerHTML += messageData;
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  };
})();

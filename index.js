const app = require("express")();
const cors = require("cors");
const httpServer = require("http").createServer(app);
app.use(cors());

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(httpServer, {
   cors: {
      origin: "*",
   },
});

io.on("connection", (socket) => {
   socket.on("join-request", ({ name, phoneNumber }, callback) => {
      socket.join(phoneNumber);
      console.log("A user is connected to ", phoneNumber);
      callback({ isRegistered: true, message: "User is registered at the server." });
   });

   socket.on("send-message", ({messageInput, phoneNumber, sender}) => {
      console.log("sending message to ", phoneNumber);
      socket.to(phoneNumber).emit("receive-message", {text: messageInput, time: getTime(), phoneNumber, sender})
   });

   socket.on("disconnect", () => {
      console.log("A user is disconnected");
   });
});

httpServer.listen(PORT, () => {
   console.log("Server is Up and Running at port number: " + PORT + "");
});

function getTime() {
   const time = new Date();
  return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

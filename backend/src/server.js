const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const http = require("http");
const socketio = require("socket.io");

const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://mrbarboza:J0hnnyW4lk3r@aircnc-79ony.mongodb.net/semana09?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const server = app.listen(443);
const io = socketio.listen(server);

const connectedUsers = {};

io.on("connection", socket => {
  const { user_id } = socket.handshake.query;
  connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

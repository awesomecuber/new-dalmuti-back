import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import Card from "./src/Card";
import Room from "./src/Room";
let cors = require("cors"); // why can't i import

const app = express();
const server = new http.Server(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening at :${PORT}...`);
});

app.use(cors());

let rooms: Room[] = [];

io.on("connection", (socket) => {
  socket.on("create-room", (roomName: string) => {
    // code to create room
    // emit to all clients that the room was made
  });

  socket.on("remove-room", (roomName: string) => {});

  socket.on("enter-room", (roomName: string) => {});

  socket.on("join-room", (roomName: string, username: string) => {});

  socket.on("leave-room", (roomName: string, username: string) => {});

  socket.on("toggle-ready", (roomName: string, readyStatus: boolean) => {});

  socket.on("call-revolution", (roomName: string) => {});

  socket.on("select-tax", (roomName: string, selectedCards: Card[]) => {});

  socket.on("play-hand", (roomName: string, selectedCards: Card[]) => {});

  socket.on("pass-turn", (roomName: string) => {});
});

function getRoomList() {
  let roomList = rooms.map(room => {
    return {
      room: room.name,
      joinable: room.state === 0, // lobby
      playerCount: room.users.length
    }
  })
}

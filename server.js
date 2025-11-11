import http from "http";
import express from "express";
import { Server } from "socket.io";
import app from "./app.js";
import Message from "./models/message.model.js";
import User from "./models/user.model.js";
import translate from "node-google-translate-skidz";
import { languageCodes } from "./languageCode.js";

// const app=express();
const server = http.createServer(app);

// Socket Initailize
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Store online users
const userSocketMap = new Map();

// Delete the online user when disconnect
const disconnect = (socket) => {
  for (const [userId, socketId] of userSocketMap.entries()) {
    if (socketId === socket.id) {
      userSocketMap.delete(userId);
      break;
    }
  }
};

// handle message send by user in real time and translate msg
const sendMessageHandler = async (data) => {
  const { sender, recepient, content, messageType, fileUrl } = data;


  // Finder Users
  const senderDetail = await User.findById(sender);
  const recepientDetail = await User.findById(recepient);


  // Get language of both user
  const senderlang = senderDetail.language;
  const recepientlang = recepientDetail.language;

  const newMessage = await Message.create({
    sender,
    recepient,
    content,
    messageType,
    fileUrl,
  });

  // get the socket id if exist
  const recepientSocketId = userSocketMap.get(recepient);
  const senderSocketId = userSocketMap.get(sender);

  // Send if recepientSocket id exist
  if (recepientSocketId) {

    // send msg if both is auto
    if (senderlang === "auto" && recepientlang === "auto") {
      io.to(recepientSocketId).emit("receiveMessage", newMessage);
    } 
    // send msg if senderLang is set and recepientlang is not
    else if (senderlang !== "auto" && recepientlang === "auto") {
      io.to(recepientSocketId).emit("receiveMessage", newMessage);
    } 
    else {
      // Translate the msg
      const translatedMessage = await translate({
        text: content,
        source: languageCodes[senderlang] || "auto",
        target: languageCodes[recepientlang],
      });

      // add the translated msg
      const message = {
        ...newMessage._doc,
        content: translatedMessage.translation,
      };
      io.to(recepientSocketId).emit("receiveMessage", message);
    }
  }
};

//
const handleTyping = (data) => {
  console.log(data)
  const recepientId = data.recepient;
  const recepientSocketId = userSocketMap.get(recepientId);
  if (recepientSocketId) {
    io.to(recepientSocketId).emit("receiveTyping", data);
  }
};

io.on("connection", (socket) => {
  console.log("socket connected");
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
    // console.log(`userId ${userId} and socketId ${socket.id}`);
  }

  socket.on("typing", handleTyping);
  socket.on("sendMessage", sendMessageHandler);

  socket.on("disconnect", () => disconnect(socket));
});

server.listen(3000, () => console.log("server started "));

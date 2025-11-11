import express from "express"
import { isLoggedIn } from "../middleware/auth.js";
import { getMessage, updateLanguage } from "../controller/message.controller.js";


const messageRoute=express.Router();

messageRoute.get("/getmessage/:id",isLoggedIn,getMessage)
messageRoute.put("/language",isLoggedIn,updateLanguage)

export default messageRoute
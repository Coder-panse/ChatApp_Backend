import express from 'express'
import { Login, Logout, Signup, updateProfile } from '../controller/user.controller.js'
const userRoute=express.Router()
import { upload } from '../config/multerconfig.js'

userRoute.post("/signup",upload.single("image"),Signup)
userRoute.post("/login",Login)
userRoute.get("/logout",Logout)


export default userRoute
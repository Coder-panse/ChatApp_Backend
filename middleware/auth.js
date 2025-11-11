import { error } from "console"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const isLoggedIn=async (req,res,next)=>{
    if(!req.cookies.userToken) res.send("/login")
    if(req.cookies.userToken == "") res.send("/login")

        else{
           jwt.verify(req.cookies.userToken,"secret",async(error,result)=>{
                if(result){
                    const userId=await User.findOne({email:result.email})
                    req.user=userId
                    next()
                }
                else{
                    console.log(error)
                    res.status(400).json({msg:"Unauthorised User"})
                }
           })
           
        }
}
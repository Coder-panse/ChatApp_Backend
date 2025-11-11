import User from "../models/user.model.js";

export const searchContact=async(req,res)=>{
    try {
        const {search}=req.body;
    
        if(search === undefined || search === null){
            return res.status(404).send("Search can't be Empty")
        }

        const sanitizedSearch=search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regEx=new RegExp(sanitizedSearch,"i")

        const contacts=await User.find({
            $and:[{_id:{$ne:req.userId}},{
                $or:[{username:regEx},{email:regEx}]
            }]
        })

        return res.status(200).json({contacts})
    } catch (error) {
        console.log({error})
    }
}
const { expressjwt} = require("express-jwt");
const User=require("../models/user");
exports.requireSignin = expressjwt({secret: "tghweoidolasdkfjfoasdkjfsds53f",algorithms: ["HS256"],
userProperty: "auth"});
exports.authMiddle=async(req,res,next)=>{
    try{
        console.log("here",req.auth)
        const user=await User.findById(req.auth._id);
        if(user)
        {
            req.profile=user;
            next();
        }
        else
        {
            res.status(404).json("user is not found")
        }
    }
    catch(error)
    {
        res.status(400).json("error in server")
    }
}


exports.authMiddleAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.auth._id);
        if(user&&user.role==="admin")
        {
            req.profile=user;
            next();
        }
        else
        {
            res.status(404).json("user is not found")
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(400).json("error in server")
    }
}
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose")
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({error:"user must be logged in !"});
    }

    const token = authorization.replace("Bearer ","")

    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"user must be logged in !"})
        }
        const {_id} = payload
        User.findOne({_id:_id}).then(userData=>{
            req.user = userData;
            next();
        })
        .catch(err=>{
            console.log(err);
        })
    })
}
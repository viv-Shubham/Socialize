const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt= require("bcryptjs")
const User = mongoose.model("User")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config/keys.js")
const requireLogin = require("../middleware/requireLogin")
const crypto = require('crypto')

router.get("/protected",requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post("/signup",(req,res)=>{
    const {name,email,password,picUrl} = req.body;
    if(!name || !email || !password){
        return res.status("422").json({error:"Required fields can not be empty !"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(savedUser) {
        return res.status("422").json({error:"User already exists with that credentials !"})
        }

        bcrypt.hash(password,12,(err,hash)=>{
            const user = new User({
                name:name,
                email:email,
                password:hash,
                picUrl
            })
            user.save()
            .then(user=>{
                res.json({message:"successfully registered, now you can sign in"})
            })
            .catch(err=>{
                console.log(err);
            })
        });
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,picUrl,followers,following} = savedUser
               res.json({token,user:{_id,name,email,picUrl,followers,following}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return console.log(err);
        }
        // console.log(buffer);
        const token = buffer.toString('hex');
        // console.log(token);
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({error: 'No user with that email'})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600*1000;
            user.save().then(result => {
                transport.sendMail({
                    to: user.email,
                    from: 'no-reply@gmail.com',
                    subject: 'Reset password link',
                    html: `
                    <p>You Requested for password reset</p>
                    <h5>Click <a href="https://socialize.herokuapp.com/reset/${token}">here</a> to reset Password</h5>
                    <p> This link will expire after 1 hour </p>
                    `
                })
                res.json({message: 'Please Check Your mail'})
            })
        })
    })
})

router.post('/reset-pass',(req,res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken: sentToken,expireToken: {$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error: 'Session Expired'})
        }
        bcrypt.hash(newPassword,10)
        .then(pass => {
            user.password = pass;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then(savedUser => res.json({message: 'Password updated Sucessfully!'}))
        })
    })
    .catch(e => console.log(e))
});

module.exports = router
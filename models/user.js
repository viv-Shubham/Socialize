const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type : String ,
        required : true
    } ,
    email:{
        type : String ,
        required : true
    } ,
    password:{
        type : String ,
        required : true
    } ,
    picUrl:{
        type : String,
        default:"https://res.cloudinary.com/viv-shubham/image/upload/v1598748595/user-3331256__340_fkqw7a.png"
    }
    ,
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    resetToken:{type: String},
    expireToken:{type: Date}

})

mongoose.model("User",userSchema);


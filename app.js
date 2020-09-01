const express = require("express");
const app = express()
var bodyParser = require('body-parser')
const mongoose = require("mongoose");
const {MONGOURI} = require("./config/keys");
const PORT = process.env.PORT || 5000
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(MONGOURI,{useNewUrlParser:true , useUnifiedTopology: true , useFindAndModify: false});

mongoose.connection.on('connected',()=>{
    console.log("connected ;)");
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting :(  : ",err);
})

require("./models/user");
require("./models/post")
app.use(bodyParser.json())
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server has started on",PORT);
})
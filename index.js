const express = require('express');
const mongoose = require("mongoose")

const app = express()

app.set("view engine","ejs")


app.get("/",(req,res)=>{
    res.render("ya.ejs")
})

app.listen(4000,()=>{
    console.log("on port 4000");
})
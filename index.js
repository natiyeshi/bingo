const express = require('express');
const mongoose = require("mongoose")

const app = express()
const PORT = 4000 
app.set("view engine","ejs")
app.use(express.static("public"))
app.use("/css",express.static(__dirname+"public/css"))
app.use("/js",express.static(__dirname+"public/js"))
app.use("/img",express.static(__dirname+"public/img"))


// scemas
const [AdminModel,UserModel] = require("./mongo/schemas") 
// routers
const adminRouter = require("./routes/admin")
const dealerRouter = require("./routes/dealer")
app.use("/admin",adminRouter)
app.use("/dealer",dealerRouter)


mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost/bingo",()=>{
    console.log("connected")}
)

app.get("/",(req,res)=>{
    res.redirect("dealer")
})


app.listen(4000,()=>{
    console.log("on port 4000");
})


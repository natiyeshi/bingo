const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require("connect-mongo")

const app = express()
const port = process.env.PORT | 4000 

app.set("view engine","ejs")
app.use(express.static("public"))
app.use("/css",express.static(__dirname+"public/css"))
app.use("/js",express.static(__dirname+"public/js"))
app.use("/img",express.static(__dirname+"public/img"))


//middlewares
const {isDealerIn,isDealerNotIn,isAdminIn,isAdminNotIn} = require("./mongo/middleware") 

// routers
const adminRouter = require("./routes/admin")
const dealerRouter = require("./routes/dealer")
//db connections
const { dealerLogin,adminLogin } = require("./mongo/functions")
 
// app.use(express.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// const url = "mongodb://127.0.0.1:27017/bingo"
const url = "mongodb+srv://natiyeshimongo:natiyeshimongo@cluster0.aliussy.mongodb.net/bingo"

//sessions
app.use(session({
    secret:"fdasddfadsfas", 
    saveUninitialized:false, 
    resave:false,
    store:MongoStore.create({ 
        mongoUrl:url
    }),  
    Cookie:{maxAge:1000*60*60*24}
}))
 

app.use("/admin",isAdminIn,adminRouter)
app.use("/dealer",isDealerIn,dealerRouter)


mongoose.set("strictQuery", false);
mongoose.connect(url,()=>{ 
    console.log("connected")
})

app.get("/",isDealerNotIn,(req,res)=>{ 
    res.render("deller/login.ejs")
}) 

app.post("/login",async (req,res)=>{
    let {username,password} = req.body
    let pass = true
    let userError = passError = ""
    if(username.trim() == ""){
        pass = false
        userError = " *"
    }
    if (password.trim() == ""){
        pass = false
        passError = " *"
    }
    if(!pass){
        return res.render("deller/login.ejs",{userError,passError,username,password})
    }
    let checker = await dealerLogin(username,password)
    if(checker.pass == false){
        userError = "Incorrect username or"
        passError = "Incorrect password"
        return res.render("deller/login.ejs",{userError,passError,username,password})
    }
    req.session.data = checker.data
    req.session.loged = true
    res.redirect("dealer")
})

app.get("/login/admin",async (req,res)=>{
    res.render("admin/login")
})

app.post("/login/admin",isAdminNotIn,async (req,res)=>{
    let {username,password} = req.body
    let pass = true
    let userError = passError = ""
    if(username.trim() == ""){ 
        pass = false
        userError = " *"
    }
    if (password.trim() == ""){
        pass = false
        passError = " *"
    }
    if(!pass){
        return res.render("admin/login.ejs",{userError,passError,username,password})
    }
    let checker = await adminLogin(username,password)
    if(checker.pass == false){
        userError = "Incorrect username or"
        passError = "Incorrect password"
        return res.render("admin/login.ejs",{userError,passError,username,password})
    }
    req.session.data = checker.data
    req.session.admin = true
    res.redirect("/admin")
    
})

app.listen(port,()=>{
    console.log(`on port ${port}`);
})


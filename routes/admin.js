const express = require('express');
const router = express.Router()

//functions 
let {getRate,setRate,chargeDealer,
    changePasswordAdmin,addDealer,
    getAllDealers,deleteDealer,isUsernameExist
} = require("../mongo/functions")


router.get("/",(req,res)=>res.render("admin/admin"))
router.get("/home",(req,res)=>res.render("admin/admin"))
router.get("/addDealer",(req,res)=>res.render("admin/addDeller"))
router.get("/editProfile",(req,res)=>res.render("admin/editProfile"))

router.post("/createDealer",async (req,res)=>{
    let {username,password,confirm,amount} = req.body
    let pass = true
    let userError = passError = confirmError = ""
    if(username.trim() == ""){ 
        pass = false
        userError = " *"
    }
    if (password.trim() == ""){
        pass = false
        passError = " *"
    }
    if (confirm.trim() == ""){
        confirmError = false
        confirmError = " *"
    }
    if(!pass){
        return res.render("admin/addDeller.ejs",{userError,passError,confirmError,username,amount})
    }
    
    if (password.trim().length <= 3){
        pass = false
        passError = " password must be 4 letters,atleast"
    }
    if (username.trim().length <= 3){
        pass = false
        userError = " password must be 4 letters,atleast"
    }
    if(!pass){
        return res.render("admin/addDeller.ejs",{userError,passError,confirmError,username,amount})
    }
    if(confirm.trim() != password.trim()){
        pass = false
        confirmError = " password does not match"
    }
    let userExist = await isUsernameExist(username) 
    if(userExist){
        pass = false
        userError = " Sorry this username is taken"
    }
    if(!pass){
        return res.render("admin/addDeller.ejs",{userError,passError,confirmError,username,amount})
    }
    
    res.redirect("/admin")
    addDealer(username,password,amount)

})

router.post("/getAllDealers",async (req,res)=>{
    let data = await getAllDealers()
    res.send(data)
}) 

router.post("/deleteDealer",async (req,res)=>{
    await deleteDealer(req.body.id)
    res.sendStatus(200)
}) 

router.post("/setRate",async (req,res)=>{
    await setRate(req.session.data._id,req.body.rate)
    res.send("Ok")
})

router.post("/getRate",async (req,res)=>{
    let rate = await getRate(req.session.data._id)
    console.log(rate,"-r-")
    res.send(rate) 
})


router.post("/chargeDealer",async (req,res)=>{
    balance = 0
    if (req.body.balance != ""){
        balance = parseInt(req.body.balance)
        if(balance < 0)  balance = 0
    }
    await chargeDealer(req.body.id,balance)
    res.sendStatus(200)
})
  

router.post("/changePassword",async (req,res)=>{
    let {oldPassword, newPassword, confirm} = req.body
    let oldErr = newErr = ""
    let confirmErr = ""
    if (req.session.data.password !== oldPassword ){
        oldErr = " password do not much"
        return res.render("admin/editProfile.ejs",{oldErr})
    }
    newPassword = newPassword.trim()
    confirm = confirm.trim()
    if (newPassword.length < 4){
        newErr = " password should be at least 4 characters"
        return res.render("admin/editProfile.ejs",{newErr})
    }
    if (newPassword !== confirm){
        confirmErr = " wrong confirm password"
        return res.render("admin/editProfile.ejs",{confirmErr})
    }    
    let files = await changePasswordAdmin(req.session.data._id,newPassword)
    req.session.data = files[0]
    res.redirect("home")
})
  
router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("home")
})

 
module.exports = router  
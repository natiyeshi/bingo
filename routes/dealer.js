const express = require('express');
const router = express.Router()
// functions
let {getBalance,setBalance,getAllFiles} = require("../mongo/functions")
// login admin

router.get("/",(req,res)=>{
    let {balance,username} = req.session.data
    res.render("deller/dealer.ejs",{balance,username})
})


router.post("/getBalance",async (req,res)=>{ 
    let {_id} = req.session.data    
    let balance = await getBalance(_id)
    return res.send(balance.toString())
})

router.post("/setBalance",async (req,res)=>{ 
    let {_id} = req.session.data    
    let newBalance = req.body.balance
    await setBalance(_id,newBalance)
    return res.send()
})

router.post("/getAllData",async (req,res)=>{
    let data = await getAllFiles(req.session.data._id)
    res.send(data)
})

router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/") 
})

module.exports = router   
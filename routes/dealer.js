const express = require('express');
const router = express.Router()
// functions
let {
        getRate,getBalance,
        setBalance,getAllFiles,
        setHistory,getHistory
    } = require("../mongo/functions")
// login admin
 
router.get("/",(req,res)=>{
    let {balance,username} = req.session.data
    res.render("deller/dealer.ejs",{balance,username})
})

router.get("/profile",(req,res)=>{
    res.render("deller/profile.ejs")
})


router.post("/getBalance",async (req,res)=>{ 
    let {_id} = req.session.data    
    let balance = await getBalance(_id)
    return res.send(balance.toString())
})

router.post("/setBalance",async (req,res)=>{ 
    let {_id} = req.session.data    
    let {balance,totalBet,winner} = req.body
    let betGain = totalBet - winner
    betGain = Math.floor(betGain * 100) / 100
    balance = Math.floor(balance * 100) / 100
    await setBalance(_id,balance)
    await setHistory(_id,totalBet,winner,betGain)
})

router.post("/getRate",async (req,res)=>{
    let rate = await getRate(req.session.data._id)
    res.send(rate) 
})

router.post("/getHistory",async (req,res)=>{
    let history = await getHistory(req.session.data._id)
    res.send(history) 
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
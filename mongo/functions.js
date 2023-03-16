const [adminModel,dealerModel] = require("./schemas")

async function dealerLogin(username,password){
    let file = await dealerModel.find({username,password})
    if(file.length > 0){
        return {pass : true,data:file[0]}
    } 
    return {pass : false}
}

async function adminLogin(username,password){
    let file = await adminModel.find({username,password})
    if(file.length > 0){
        return {pass : true,data:file[0]}
    } 
    return {pass : false}
}

async function getBalance(id){
    let data = await dealerModel.findOne({_id:id})
    return data.balance
}

async function setBalance(id,balance){
    await dealerModel.updateOne({_id:id},{$set:{balance}})
}

async function getAllFiles(_id){
    return await dealerModel.findOne({_id})
}


async function addDealer(username,password,balance = 0){
    await dealerModel.create({username,password,balance})
}

  async function getAllDealers(username,password,balance = 0){
    return await dealerModel.find()
} 

async function deleteDealer(_id){
    return await dealerModel.deleteOne({_id})
} 
async function chargeDealer(_id,balance){
    balance += await getBalance(_id) 
    await dealerModel.updateOne({_id},{$set:{balance}})
} 

async function changePasswordAdmin(_id,password){
    await adminModel.updateOne({_id},{$set:{password}})
    return await adminModel.find({_id})    
}

async function setRate(_id,rate){
    await adminModel.updateOne({_id},{$set:{rate}})
}

async function getRate(_id){
    let result = await adminModel.findOne({username:"admin"})
    return result.rate
}

async function setHistory(_id,totalBet,winner,betGain){
    let history = {totalBet,winner,betGain,time:Date.now()}
    await dealerModel.updateOne({_id},{$push:{history}})
}

async function getHistory(_id){
    let result = await dealerModel.findOne({_id},{history:1})
    return result
}


module.exports = { 
        dealerLogin,getBalance,setBalance,
        getAllFiles,adminLogin,addDealer,
        getAllDealers,deleteDealer,chargeDealer,
        changePasswordAdmin,setRate,getRate,
        setHistory,getHistory
    } 
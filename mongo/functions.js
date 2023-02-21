const [adminModel,dealerModel] = require("./schemas")

async function dealerLogin(username,password){
    let file = await dealerModel.find({username,password})
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


module.exports = {dealerLogin,getBalance,setBalance,getAllFiles}
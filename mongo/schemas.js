const mongoose = require('mongoose');

const adminScema = new mongoose.Schema({
    username : String,
    password : String,
    balance : {
        default:0
    }
})

const dealerScema = new mongoose.Schema({
    username : String,
    password : String,
    balance : {
        type:Number,
        default:0
    },
    balanceHistory :  {
        type : [Number],
        default : [0]
    },
    createdAt : {
        type:Date,
        default : () => Date.now()
    }
    
})

module.exports = [
    mongoose.model("admin",adminScema),
    mongoose.model("dealer",dealerScema)
]
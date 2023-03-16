const mongoose = require('mongoose');

const adminScema = new mongoose.Schema({
    username : String,
    password : String,
    rate:{
        default: 0
    },
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
    history:{
        type:[Object],
        default:[Object]
    },
    createdAt : {
        type:Date,
        default : () => Date.now()
    }
    
})

module.exports = [
    mongoose.model("admins",adminScema),
    mongoose.model("dealers",dealerScema)
]
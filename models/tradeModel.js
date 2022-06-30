const mongoose = require("mongoose")

const TradeSchema = mongoose.Schema({
    marketTime : {
        type: String,
        required: true,
        minlength: 1
    },
    balance: {
        type: String,
        required: true,
        minlength: 1
    },
    equity: {
        type: String,
        required: true,
        minlength: 1

    },
    identicalCount: {
        type: Number,
        default: 1
    }

})

TradeSchema.methods.getData = function(){
    return this.select("-_id")
}

/**
 * @desc returns the last n documents entered into collection
 * @param {number} n 
 */
TradeSchema.statics.findLastN = function(n){
    return this.where().sort({'_id' : -1}).limit(n).select("-__v")
}
const TradeModel = mongoose.model("TradeModel", TradeSchema)



module.exports = TradeModel
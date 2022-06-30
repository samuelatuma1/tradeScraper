const mongoose = require("mongoose")

/**
 * @desc Connects to MongoDB DataBase ScraperDB
 */
async function MongoDB (){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/ScraperDB")
        console.log('connected to database')
    }catch(err){
        console.log("Unable to connect to DB. Check below for reasons")
        console.log("##################################################")
        console.log(err)
        console.log("##################################################")

    }
}

module.exports = MongoDB

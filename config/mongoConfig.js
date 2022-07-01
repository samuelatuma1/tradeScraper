const mongoose = require("mongoose")

require("dotenv").config()
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@cluster0.k7wdg.mongodb.net/?retryWrites=true&w=majority`;

const uri2 = ("mongodb://127.0.0.1:27017/ScraperDB")
/**
 * @desc Connects to MongoDB DataBase ScraperDB
 */
async function MongoDB (){
    try{
        await mongoose.connect(
            uri,
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => console.log(" Mongoose is connected to " + uri)
          )
    }catch(err){
        console.log("Unable to connect to DB. Check below for reasons")
        console.log("##################################################")
        console.log(err)
        console.log("##################################################")

    }
}


// Connect to the MongoDB cluster


module.exports = MongoDB

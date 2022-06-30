
const TradeModel =  require("../models/tradeModel")
const {scrapeMetaTrade} = require("../utilities.js")


/**
 * @desc scrapes metatrader, stores result in TradeModel. 
 * @returns null if unable to scrape else, at most 30 most recent results
 */
async function scrapeAndStoreTrade(){
    try{
        // Scrape Data
        const currTradeData = await scrapeMetaTrade()
        console.log(currTradeData)
        // If scrape returns nothing, return null
        if(!currTradeData){
            return null
        }

        // Save data to TradeModel
        const newData = await TradeModel.create(currTradeData)
        await newData.save()

        // Return at most last 30 entries from TradeModel
        const latestData = await TradeModel.findLastN(30)
        return latestData

    } catch (err){
        return null
    }
}
/**
 * @desc asynchronous function retrieves all trade data
 */
async function retrieveAll(){
    const allData = await TradeModel.where().sort({_id: -1}).select("-__v")
    return allData
}
module.exports = {scrapeAndStoreTrade, retrieveAll}
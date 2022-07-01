// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))



/**
 * @desc Slice out data from beginning to first :(colon) , removes white space
 * @param {String} text 
 * @returns {String} :-> Returns strippped string
 */
const sliceThroughFirstColon = (text) => {
    const firstColIdx = text.indexOf(":")
    if (firstColIdx === -1){
        return ''
    }
    // slice off from beginning to index of :
    return text.slice(firstColIdx + 1).replaceAll(" ", "")
}



/**
 * 
 * @param {object} dataObject :-> object to clean. Example {
        marketWatchText: 'Market Watch: 23:56:59',
        equityBalanceText: 'Balance: 5 050.73 USD  Equity: 5 053.56  Margin: 6.92  Free margin: 5 046.64  Margin level: 73 066.34%'
    }
 * @returns {object | null} cleaned Data example { marketTime: '23:56:59', balance: '5050.73', equity: '5053.56' }
 */
function cleanData(dataObject){
    try{
        const {marketWatchText, equityBalanceText} = dataObject;

        //  Get market watch time from example : 'Market Watch: 23:56:59'
        // slice off from beginning to index of :
        const marketTime = sliceThroughFirstColon(marketWatchText)

        // Get balance
        let balanceEndIdx = equityBalanceText.indexOf("USD")
        const balanceData = equityBalanceText.slice(0, balanceEndIdx)
        const balance = (sliceThroughFirstColon(balanceData))

        // Get equity 
        const equityEndIdx = equityBalanceText.indexOf("Margin")  >= 0 ? equityBalanceText.indexOf("Margin") : equityBalanceText.indexOf("Free margin")
        const equityBalance = equityBalanceText.slice(balanceEndIdx, equityEndIdx)
        const equity = sliceThroughFirstColon(equityBalance)

        const result = {marketTime, balance, equity}
        return result
    } catch (err){
        return null
    }
}




/**
 * @desc scrapes metatrade website for Equity, Balance and Market Watch Time
 * @returns {Promise} that resolves to interface like -> { marketTime: '23:56:59', balance: '5 050.73', equity: '5 053.56  ' } or null if there happens to be an error
 */
async function scrapeMetaTrade() {
    try{
        // Set up puppeteer-extra
        // const chrome = await puppeteer.launch({headless : false})
        const chrome = await puppeteer.launch()
        const page = await chrome.newPage()
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');

        await page.goto("https://trade.mql5.com/trade?servers=", {waitUntil: 'networkidle2', timeout: 120000 })
        
        // Wait for Page Load
        await page.waitForSelector('#login', {timeout: 120000})
        
        // Fill out form with log in details
        const loginInput = "66337396"
        const passwordInput = "lnja32"
        const serverInput = "ICMarketsSC-Demo06"

            // type into login, password and server field
        await page.type("input#login", loginInput)
        await page.type("input#password", passwordInput)
        // Clear serverInput before typing
            // Click thrice, Then press Backspace (To clear input field)
            const serverField = await page.$('input#server')
            await serverField.click({clickCount: 3})
            await serverField.press("Backspace")
        await page.type('input#server', serverInput)

        // Submit form
        await page.click("body > div:nth-child(14) > div > div.b > button:nth-child(18)")

        // Wait for  desired data to load
        const equityBalanceSelector = "body > div.page-block.frame.bottom > div:nth-child(3) > table > tbody > tr.total > td.iconed > div > span"
        const marketWatchSelector = "body > div.page-window.market-watch.compact > div > div.h"
        await page.waitForSelector(equityBalanceSelector)
        await page.waitForSelector(marketWatchSelector)

       

        let marketWatchText = await page.$eval(marketWatchSelector, element => element.innerText)
        // Ensure marketWatchText has marketWatchTime
        while(!marketWatchText.includes(":")){
            await page.waitForTimeout(1000)
            marketWatchText = await page.$eval(marketWatchSelector, element =>  element.innerText)    
        }
         // Access desired data
         const equityBalanceText = await page.$eval(equityBalanceSelector, element => element.innerText)

        // Clean data, return necessary from given result
        // Return clean Data if valid result, else, null
        const cleaned = cleanData({marketWatchText, equityBalanceText})
        
        // Close puppeteer
        await chrome.close()
        return cleaned ? cleaned : null

    } catch(err){
        console.log(err)
        return null
    }
}


// scrapeMetaTrade().then(d => console.log('returned data => ', d))
// setInterval(() => {scrapeMetaTrade()}, 300000)
module.exports = {
    sliceThroughFirstColon, cleanData, scrapeMetaTrade
}
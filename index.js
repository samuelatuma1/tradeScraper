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



async function scrapTrade() {
    try{
        const chrome = await puppeteer.launch({headless : false})
        const page = await chrome.newPage()
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');

        await page.goto("https://trade.mql5.com/trade?servers=", {waitUntil: 'networkidle2' })
        
        // Wait for Page Load
        await page.waitForSelector('#login')
        
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

        // Access desired data
        const equityBalanceText = await page.$eval(equityBalanceSelector, element => element.innerText)
        const marketWatchText = await page.$eval(marketWatchSelector, element => element.innerText)
        console.log({marketWatchText, equityBalanceText} )

        console.log('Done')
        
        // Close puppeteer
        // chrome.close()
    } catch(err){
        console.log(err)
    }
}

scrapTrade()
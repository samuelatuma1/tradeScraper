const puppeteer = require("puppeteer")
const fs = require("fs/promises")
const path = require("path")
// Function contains getting started with puppeteer

// Most functionalities puppeteer provides are asynchronous
async function scraper(){
    try{
        // SETUP
        // Launch puppeteer
        const browser = await puppeteer.launch()
        // Launch the website we want to visit ish...
        const page = await browser.newPage()
        // Connect to the web page we want to access
        // await page.goto("https:google.com") // No need to hold in variable.

        // USEAGE
        // Take screenshot
        // await page.screenshot({path: './staticgooglescreen.png'})

        // // Take screenshot of full page (regardless of window size)
        // await page.goto("https://en.wikipedia.org/wiki/JavaScript")
        // await page.screenshot({ path: 'wikijs.png', fullPage: true })

        // Visit site https://learnwebcode.github.io/practice-requests/
        let pageUrl = "https://learnwebcode.github.io/practice-requests/"
        await page.goto(pageUrl)
        // Screenshot
        // await page.screenshot({path: './static/learnweb.png', fullPage: true})


        // Given a page we are in, if we want to do some client side javaScript stuff, we can
        // - use evaluate to access client side javaScript e.g the DOM
        //  e.g
        // Get all strong innerText in .info class
        let animalsInfo = await page.evaluate(() => {
            //  Think of evaluate as that we are within the client side JavaScript
            let animalInfo = document.querySelectorAll(".info strong")
            let infoToArr = Array.from(animalInfo).map(htmlElem => htmlElem.innerText)

            // We only have access to data this returns. because inside here is inside the client side
            // Data returned should be a valid server side data type
            return infoToArr
        })
        // Write file content to animalsName.txt
        // const data = await fs.writeFile(path.join(__dirname , 'static/animalNames.txt'), animalsInfo.join('\r\n'))

        // An alternative way to get DOM elements as an array
        const myAltAnimalInfo = await page.$$eval('.info strong', (animalsElem) => {
            return animalsElem.map(x => x.innerText)
        })

        // fs.writeFile("./static/animals.txt", myAltAnimalInfo.join("\r\n"))
        // To get just A single DOM element use $eval(selector, (singleElem) => { ... return (...)})
        
        
        console.log(animalsInfo)

        // Close browser
        await browser.close()

    }
    catch (err){
        console.log(err)
    }

}

async function reinforceConcept(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const pageDetails = await page.goto( "https://learnwebcode.github.io/practice-requests/")
    // Say we want to get all images and save them on our drive, we can
    
    const imgs = await page.$$eval("img", (imgs) => {
        return imgs.map(img => img.src)
    })

    for (let img of imgs){
        // Go to img url
        const imgPage = await page.goto(img)

        // Store content in your system
        await fs.writeFile(`./static/${img.split("/").pop()}`, await imgPage.buffer())
        console.log("Done")
    }

}


// Simulating The click Event
async function ClickButton(){
    // -> Premise :-> Clicking the button adds text to a div with id data.
        // -> We want to click this button and get the text
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // console.log(page)
    const pageDetails = await page.goto( "https://learnwebcode.github.io/practice-requests/")
    
    // To simulate a click, use page .click(selector)
    const btn = await page.click("#clickme")

    // Once clicked, data is added to the #data div
    const textDivData = await page.$eval("#data", (textDiv) => textDiv.innerText)
    console.log(textDivData)
}

// Submitting form and navigating to result
// We can write text in inputs using the syntax el.type(selector, value)
// We can wait for Navigation  using the syntax page.waitForNavigation()
async function inputValAndSubmitForm(){
    try{
        const browser = await puppeteer.launch()
    
    const page = await browser.newPage()
    await page.goto("https://learnwebcode.github.io/practice-requests/")

    // Type to input
    await page.type("#ourfield", "blue")

    // Click submit Button, await navigation
    await Promise.all([page.click("#ourform button"), page.waitForNavigation()])

    // Get text fro #message
    const text = await page.$eval("#message", (element) => element.innerText)
    console.log(text)
    } catch(err){
        console.log("An error occured")
    }
    
    browser.close()
    
}

async function scrapeNode(){
     const browser = await puppeteer.launch()
     const page = await browser.newPage()
     await page.goto("https://hevodata.com/learn/mongodb-atlas-nodejs/")

     

  

     browser.close()
}
scrapeNode()
// setInterval(inputValAndSubmitForm, 15000)
inputValAndSubmitForm()
// ClickButton()
// reinforceConcept()
// scraper()
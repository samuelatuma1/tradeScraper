const mongoose = require("mongoose")

const mongoDB = require("./config/mongoConfig.js")
mongoDB()

const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")

// use env
require("dotenv").config()

// Set up express server
const express = require("express")
const app = require("express")()

// Use cors middleware
app.use(cors())

// Set up server
const server = http.createServer(app)

// Set up path
const path = require("path")

// Set up io, allow http://localhost:3000
const io = new Server(server, {
    cors: {
        origin: "*:*",
        methods: ["GET", "POST"]
    }
})


// Require Scrape
const {scrapeAndStoreTrade, retrieveAll} = require("./controller/tradeController.js")

let updatedTradeData = [];

async function updateTradeData(){
    // Call scrapeAndStoreTrade
    let scrapeRes = await scrapeAndStoreTrade()
    // If scrapeRes, update updatedTradeData to reflect changes
    if(scrapeRes){
        console.log("Scrape successful")
        updatedTradeData = scrapeRes
        emitChange()
    }
}

function emitChange(){
    console.log("emitting new data")
    // Send Updated Data
    io.emit("new data", JSON.stringify(updatedTradeData))
}

async function emitRetrieveAll(){
    console.log("Retrieving all")
    const allData = await retrieveAll()
    console.log(allData)
    console.log("Retrieved")
    io.emit("all data", JSON.stringify(allData))
}


io.on("connection", socket => {
    console.log("client connected")
    socket.on("retrieve all", emitRetrieveAll)
    socket.on("retrieve most recent", emitChange)
})


updateTradeData()

const waitTime = 5 * 60 * 1000
setInterval(updateTradeData, waitTime)


// Setup react app as view
app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const port = process.env.PORT || 9000
server.listen(port, () => console.log(`Listening on PORT: ${port}`))


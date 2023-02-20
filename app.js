const express = require("express")
const app = express()
const { getTopics } = require("./controlllers/ncNewsController")

app.get("/api/topics", getTopics)

//get request for /api/topics
//Need to make components folder and models folder
//error handlind will need to be done

module.exports = app;
const express = require("express")
const app = express()
const { getTopics, getArticles } = require("./controlllers/ncNewsController")
const { handle500Statuses} = require("./controlllers/errorHandlingController")
//app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.all('*', (req, res, next)=>{
    res.status(404).send({message: "invalid pathway"})
})


app.use(handle500Statuses)

module.exports = app;
const express = require("express")
const app = express()
const { getTopics, getArticles } = require("./controlllers/ncNewsController")
const {handle404Statuses, handle500Statuses} = require("./controlllers/errorHandlingController")
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.all('*', (req, res, next)=>{
    next({status:404})
})

app.use(handle404Statuses);
app.use(handle500Statuses)

module.exports = app;
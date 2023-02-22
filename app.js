const express = require("express")
const app = express()
const { getTopics, getArticles, getArticlesById } = require("./controlllers/ncNewsController")
const { handle500Statuses, handlePSQLErrors, handleCustomErrors} = require("./controlllers/errorHandlingController")


app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticlesById)

app.all('*', (req, res, next)=>{
    res.status(404).send({message: "invalid pathway"})
})

app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handle500Statuses)

module.exports = app;
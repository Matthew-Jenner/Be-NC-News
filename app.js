const express = require("express")
const app = express()
const { getTopics, getArticles, getArticlesById, getComments, postComment } = require("./controlllers/ncNewsController")
const { handle500Statuses, handlePSQLErrors, handleCustomErrors} = require("./controlllers/errorHandlingController")
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)

app.all('*', (req, res, next)=>{
    res.status(404).send({message: "invalid pathway"})
})


app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handle500Statuses)

module.exports = app;
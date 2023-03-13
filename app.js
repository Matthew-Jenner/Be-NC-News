const express = require("express")
const app = express()
const { getTopics, getArticles, getArticlesById, getComments, postComment, patchVotes, getUsers, deleteComment, getEndpoints } = require("./controlllers/ncNewsController")
const { handle500Statuses, handlePSQLErrors, handleCustomErrors} = require("./controlllers/errorHandlingController")
app.use(express.json())
const cors = require('cors');

app.use(cors());

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)
app.get("/api/users", getUsers)
app.patch("/api/articles/:article_id", patchVotes)
app.delete("/api/comments/:comment_id", deleteComment)

app.all('*', (req, res, next)=>{
    res.status(404).send({message: "invalid pathway"})
})


app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handle500Statuses)

module.exports = app;
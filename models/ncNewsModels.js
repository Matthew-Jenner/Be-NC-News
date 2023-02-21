const db = require("../db/connection")

exports.fetchTopics = () => {
return db.query("SELECT * FROM topics;")
.then((result) => result.rows)
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.*, 
    COUNT(comments.article_id) :: INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then((result) => result.rows)
    }
